import { db, ensureDB } from '~~/server/utils/db'
import exifr from 'exifr'
import sharp from 'sharp'
import { randomUUID, createHash } from 'node:crypto'
import { uploadToOSS, getSignedUrl, generateOSSKey } from '~~/server/utils/oss'
import { dateFromFileName } from '~~/server/utils/filename-date'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, message: 'No file provided' })

  const albumId = form.find((f) => f.name === 'albumId')?.data.toString() || null
  const filePart = form.find((f) => f.name === 'file')
  if (!filePart?.data) throw createError({ statusCode: 400, message: 'No file provided' })

  const buffer = filePart.data
  const fileName = filePart.filename || `photo-${Date.now()}`
  const mime = filePart.type || 'application/octet-stream'
  const isVideo = mime.startsWith('video/')
  const coverPart = form.find((f) => f.name === 'cover')
  const coverBuffer = coverPart?.data

  // 1. Extract capture date first (fast, needed for the OSS key path).
  // Images read EXIF; videos read the mp4/mov container date via exifr.
  let rawDate: string | null = null
  try {
    const raw = await exifr.parse(buffer, {
      pick: ['DateTimeOriginal', 'CreateDate'],
      raw: true,
      translateValues: false,
    })
    const dateVal = raw?.DateTimeOriginal || raw?.CreateDate || null
    if (dateVal) {
      const m = String(dateVal).match(/(\d{4})[-:](\d{2})[-:](\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
      if (m) rawDate = `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`
    }
    if (!rawDate) rawDate = dateFromFileName(fileName)
  } catch {
    rawDate = dateFromFileName(fileName)
  }

  // 2. Upload to Ali OSS (private bucket -> DB stores the OSS key)
  // Key path follows the EXIF capture time (fallback: current time)
  const keyDate = rawDate ? new Date(rawDate.replace(' ', 'T')) : new Date()
  const key = generateOSSKey('photos', fileName, keyDate)
  const videoCoverKey =
    isVideo && coverBuffer ? generateOSSKey('covers', `cover-${Date.now()}.jpg`, keyDate) : null

  // 3. Run the slow steps concurrently: OSS upload, cover upload, EXIF metadata, image size
  let meta: any = {}
  let width: number | null = null
  let height: number | null = null
  await Promise.all([
    uploadToOSS(key, buffer, mime),
    videoCoverKey && coverBuffer
      ? uploadToOSS(videoCoverKey, coverBuffer, 'image/jpeg')
      : Promise.resolve(),
    !isVideo
      ? exifr
          .parse(buffer, {
            pick: [
              'Make',
              'Model',
              'latitude',
              'longitude',
              'ISO',
              'ExposureTime',
              'FNumber',
              'FocalLength',
            ],
          })
          .then((r) => (meta = r ?? {}))
          .catch(() => {})
      : Promise.resolve(),
    !isVideo
      ? sharp(buffer)
          .metadata()
          .then((d) => {
            width = d.width ?? null
            height = d.height ?? null
          })
          .catch(() => {})
      : Promise.resolve(),
  ])
  const aspectRatio = width && height ? `${width}/${height}` : null

  // Store EXIF wall-clock time as-is (no timezone conversion),
  // so the displayed time matches what the camera captured.
  const takenAt = rawDate || new Date().toISOString().slice(0, 19).replace('T', ' ')
  const cameraMake = meta?.Make ? String(meta.Make) : null
  const cameraModel = meta?.Model ? String(meta.Model) : null
  const latitude = typeof meta?.latitude === 'number' ? meta.latitude : null
  const longitude = typeof meta?.longitude === 'number' ? meta.longitude : null

  const toNum = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  const exif = {
    iso: toNum(meta?.ISO),
    exposureTime: toNum(meta?.ExposureTime),
    fNumber: toNum(meta?.FNumber),
    focalLength: toNum(meta?.FocalLength),
  }

  const hash = createHash('md5').update(buffer).digest('hex')
  const fileSize = buffer.length

  // 3. Insert into photos table with metadata
  const [[{ id: userId }]] = (await db().query(
    'SELECT id FROM users ORDER BY created_at LIMIT 1',
  )) as any

  const id = randomUUID()
  await db().execute(
    `INSERT INTO photos (id, original_url, thumbnail_url, webp_url, video_url, video_cover, width, height, aspect_ratio, file_size, file_name, mime_type, hash, taken_at, latitude, longitude, camera_make, camera_model, is_video, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      key,
      videoCoverKey ?? key,
      videoCoverKey ?? key,
      isVideo ? key : null,
      videoCoverKey,
      width,
      height,
      aspectRatio,
      fileSize,
      fileName,
      mime,
      hash,
      takenAt,
      latitude,
      longitude,
      cameraMake,
      cameraModel,
      isVideo ? 1 : 0,
      userId,
    ],
  )

  // 4. Link to album if provided
  if (albumId) {
    await db().execute('INSERT INTO album_photos (album_id, photo_id) VALUES (?, ?)', [albumId, id])
  }

  return {
    success: true,
    data: [
      {
        id,
        fileName,
        originalUrl: getSignedUrl(key),
        webpUrl: videoCoverKey ? getSignedUrl(videoCoverKey) : getSignedUrl(key),
        thumbnailUrl: videoCoverKey ? getSignedUrl(videoCoverKey) : getSignedUrl(key),
        videoUrl: isVideo ? getSignedUrl(key) : null,
        videoCover: videoCoverKey ? getSignedUrl(videoCoverKey) : null,
        isVideo: isVideo ? 1 : 0,
        takenAt,
        cameraMake,
        cameraModel,
        latitude,
        longitude,
        width,
        height,
        aspectRatio,
        fileSize,
        exif,
      },
    ],
  }
})
