import { db, ensureDB } from '~~/server/utils/db'
import { getOSSClient } from '~~/server/utils/oss'
import { addWatermark } from '~~/server/utils/watermark'

// GET /api/photos/[id]/download - download a photo with a watermark overlay.
// Streams the original from OSS, composites the watermark, and returns it as an attachment.
export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')
  const [rows] = (await db().query('SELECT * FROM photos WHERE id = ?', [id])) as any
  const photo = rows?.[0]
  if (!photo) throw createError({ statusCode: 404, message: 'Photo not found' })

  const key = photo.original_url || photo.webp_url
  if (!key) throw createError({ statusCode: 404, message: 'Photo source not found' })

  let buffer: Buffer
  let mime = photo.mime_type || 'application/octet-stream'
  if (/^https?:\/\//.test(key)) {
    // Seed/external images are stored as full URLs, not OSS keys
    const res = await fetch(key)
    if (!res.ok) throw createError({ statusCode: 502, message: 'Failed to fetch photo source' })
    buffer = Buffer.from(await res.arrayBuffer())
    mime = res.headers.get('content-type') || mime
  } else {
    const result = await getOSSClient().get(key)
    buffer = result.content as Buffer
  }

  const config = useRuntimeConfig()
  const watermarkText = config.public.watermarkText || config.public.siteName

  if (!photo.is_video) {
    try {
      buffer = await addWatermark(buffer, watermarkText)
      if (mime === 'image/heic' || mime === 'image/heif') mime = 'image/jpeg'
    } catch {
      // fall back to the original if watermarking fails (unsupported format etc.)
    }
  }

  const fileName = photo.file_name || `photo-${id}`
  setResponseHeaders(event, {
    'Content-Type': mime,
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    'Cache-Control': 'no-store',
  })
  return buffer
})
