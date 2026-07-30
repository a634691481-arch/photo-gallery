interface UploadFile {
  file: File
  name: string
  size: number
  preview: string | null
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  error?: string
}

export function useUpload() {
  const files = ref<UploadFile[]>([])
  const uploading = ref(false)

  const addFiles = (fileList: FileList | File[]) => {
    for (const f of Array.from(fileList)) {
      files.value.push({
        file: f,
        name: f.name,
        size: f.size,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        status: 'pending',
        progress: 0,
      })
    }
  }

  const removeFile = (index: number) => {
    const f = files.value[index]
    if (f?.preview) URL.revokeObjectURL(f.preview)
    files.value.splice(index, 1)
  }

  const uploadAll = async (albumId?: string) => {
    uploading.value = true
    const pendingFiles = files.value.filter(f => f.status === 'pending')

    for (const f of pendingFiles) {
      f.status = 'uploading'
      try {
        const formData = new FormData()
        formData.append('file', f.file)
        if (albumId) formData.append('albumId', albumId)

        // Upload with progress
        const xhr = new XMLHttpRequest()
        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              f.progress = Math.round((e.loaded / e.total) * 100)
            }
          })
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`Upload failed: ${xhr.status}`))
          })
          xhr.addEventListener('error', () => reject(new Error('Upload failed')))
          xhr.open('POST', '/api/upload')
          xhr.send(formData)
        })

        f.status = 'done'
        f.progress = 100
      } catch (err: any) {
        f.status = 'error'
        f.error = err.message
      }
    }

    uploading.value = false
  }

  const clear = () => {
    files.value.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview) })
    files.value = []
  }

  return { files, uploading, addFiles, removeFile, uploadAll, clear }
}
