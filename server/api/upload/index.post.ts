import { db, ensureDB } from '~~/server/utils/db'
import exifr from 'exifr'
import sharp from 'sharp'
import { randomUUID, createHash } from 'node:crypto'
import { uploadToOSS, getSignedUrl, generateOSSKey } from '~~/server/utils/oss'

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

  // 1. Extract EXIF metadata
  let meta: any = {}
  let width: number | null = null
  let height: number | null = null
  let rawDate: string | null = null
  if (!isVideo) {
    try {
      meta = await exifr.parse(buffer, {
        pick: ['Make', 'Model', 'latitude', 'longitude'],
      })
    } catch {
      meta = {}
    }
    try {
      const raw = await exifr.parse(buffer, {
        pick: ['DateTimeOriginal', 'CreateDate'],
        raw: true,
        translateValues: false,
      })
      const dateVal = raw?.DateTimeOriginal || raw?.CreateDate || null
      if (dateVal) {
        const m = String(dateVal).match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
        if (m) rawDate = `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`
      }
    } catch {
      rawDate = null
    }
    try {
      const dims = await sharp(buffer).metadata()
      width = dims.width ?? null
      height = dims.height ?? null
    } catch {
      // ignore unsupported image formats
    }
  }

  // Store EXIF wall-clock time as-is (no timezone conversion),
  // so the displayed time matches what the camera captured.
  const takenAt = rawDate || new Date().toISOString().slice(0, 19).replace('T', ' ')
  const cameraMake = meta?.Make ? String(meta.Make) : null
  const cameraModel = meta?.Model ? String(meta.Model) : null
  const latitude = typeof meta?.latitude === 'number' ? meta.latitude : null
  const longitude = typeof meta?.longitude === 'number' ? meta.longitude : null

  // 2. Upload to Ali OSS (private bucket -> DB stores the OSS key)
  // Key path follows the EXIF capture time (fallback: current time)
  const keyDate = rawDate ? new Date(rawDate.replace(' ', 'T')) : new Date()
  const key = generateOSSKey('photos', fileName, keyDate)
  await uploadToOSS(key, buffer, mime)

  const hash = createHash('md5').update(buffer).digest('hex')
  const fileSize = buffer.length

  // 3. Insert into photos table with metadata
  const [[{ id: userId }]] = (await db().query(
    'SELECT id FROM users ORDER BY created_at LIMIT 1',
  )) as any

  const id = randomUUID()
  await db().execute(
    `INSERT INTO photos (id, original_url, thumbnail_url, webp_url, width, height, file_size, file_name, mime_type, hash, taken_at, latitude, longitude, camera_make, camera_model, is_video, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      key,
      key,
      key,
      width,
      height,
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
        webpUrl: getSignedUrl(key),
        thumbnailUrl: getSignedUrl(key),
        takenAt,
        cameraMake,
        cameraModel,
        latitude,
        longitude,
        width,
        height,
      },
    ],
  }
})
