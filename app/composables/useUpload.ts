interface UploadFile {
  file: File
  name: string
  size: number
  preview: string | null
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  error?: string
  meta?: UploadMeta
  cover?: Blob | null
  coverPromise?: Promise<Blob | null>
}

export interface UploadMeta {
  id?: string
  fileName?: string
  takenAt?: string
  cameraMake?: string | null
  cameraModel?: string | null
  latitude?: number | null
  longitude?: number | null
  width?: number | null
  height?: number | null
  fileSize?: number | null
  exif?: {
    iso?: number | null
    exposureTime?: number | null
    fNumber?: number | null
    focalLength?: number | null
  }
}

const MAX_CONCURRENT = 4

// Grab a frame from a video file and return it as a JPEG blob (used as cover).
const captureVideoCover = (file: File, maxSize = 640) =>
  new Promise<Blob | null>((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = url
    let settled = false
    const done = (b: Blob | null) => {
      if (settled) return
      settled = true
      URL.revokeObjectURL(url)
      resolve(b)
    }
    const grab = () => {
      if (!video.videoWidth || !video.videoHeight) return done(null)
      try {
        const scale = Math.min(1, maxSize / Math.max(video.videoWidth, video.videoHeight))
        const w = Math.round(video.videoWidth * scale)
        const h = Math.round(video.videoHeight * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(video, 0, 0, w, h)
        canvas.toBlob((b) => done(b), 'image/jpeg', 0.85)
      } catch {
        done(null)
      }
    }
    video.onerror = () => done(null)
    video.onloadeddata = () => {
      if (video.duration > 0.5 && video.seekable.length) {
        const onSeeked = () => {
          video.onseeked = null
          video.onerror = null
          grab()
        }
        video.onseeked = onSeeked
        video.onerror = () => grab()
        try {
          video.currentTime = 0.5
        } catch {
          grab()
        }
      } else {
        grab()
      }
    }
    setTimeout(() => done(null), 15000)
  })

const makePreview = async (file: File): Promise<string | null> => {
  if (file.type.startsWith('image/')) {
    try {
      const bmp = await createImageBitmap(file, { resizeWidth: 96 })
      const canvas = document.createElement('canvas')
      canvas.width = bmp.width
      canvas.height = bmp.height
      canvas.getContext('2d')!.drawImage(bmp, 0, 0)
      bmp.close()
      return canvas.toDataURL('image/jpeg', 0.7)
    } catch {
      return URL.createObjectURL(file)
    }
  }
  return null
}

export function useUpload() {
  const files = ref<UploadFile[]>([])
  const uploading = ref(false)

  const addFiles = (fileList: FileList | File[]) => {
    for (const f of Array.from(fileList)) {
      const entry: UploadFile = {
        file: f,
        name: f.name,
        size: f.size,
        preview: null,
        status: 'pending',
        progress: 0,
      }
      files.value.push(entry)
      if (f.type.startsWith('video/')) {
        entry.coverPromise = captureVideoCover(f).then((b) => {
          entry.cover = b
          if (b) entry.preview = URL.createObjectURL(b)
          return b
        })
      } else {
        makePreview(f).then((p) => (entry.preview = p))
      }
    }
  }

  const removeFile = (index: number) => {
    const f = files.value[index]
    if (f?.preview) URL.revokeObjectURL(f.preview)
    files.value.splice(index, 1)
  }

  const uploadOne = async (f: UploadFile, albumId?: string) => {
    const formData = new FormData()
    formData.append('file', f.file)
    if (albumId) formData.append('albumId', albumId)
    const cover = f.cover ?? (await f.coverPromise)
    if (cover) formData.append('cover', cover, 'cover.jpg')

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          f.progress = Math.round((e.loaded / e.total) * 100)
        }
      })
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText)
            f.meta = res?.data?.[0]
          } catch {
            // response not parseable; meta stays undefined
          }
          resolve()
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })
      xhr.addEventListener('error', () => reject(new Error('Upload failed')))
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })

    f.status = 'done'
    f.progress = 100
  }

  const uploadAll = async (albumId?: string) => {
    uploading.value = true
    let ok = 0
    let fail = 0
    const pendingFiles = files.value.filter((f) => f.status === 'pending' || f.status === 'error')

    let next = 0
    const worker = async () => {
      while (next < pendingFiles.length) {
        const f = pendingFiles[next++]
        f.status = 'uploading'
        try {
          await uploadOne(f, albumId)
          ok++
        } catch (err: any) {
          f.status = 'error'
          f.error = err.message
          f.progress = 0
          fail++
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT, pendingFiles.length) }, worker))

    uploading.value = false
    return { ok, fail }
  }

  const clear = () => {
    files.value.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    files.value = []
  }

  return { files, uploading, addFiles, removeFile, uploadAll, clear }
}
