import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const query = getQuery(event)
  const cursor = parseInt((query.cursor as string) || '0')
  const limit = Math.min(parseInt((query.limit as string) || '30'), 100)
  const year = query.year as string | undefined
  const month = query.month as string | undefined

  let where = 'WHERE deleted_at IS NULL'
  const params: any[] = []

  if (year) {
    if (month) {
      where += ' AND YEAR(taken_at) = ? AND MONTH(taken_at) = ?'
      params.push(parseInt(year), parseInt(month))
    } else {
      where += ' AND YEAR(taken_at) = ?'
      params.push(parseInt(year))
    }
  }

  const [[{ total }]] = (await db().query(
    `SELECT COUNT(*) as total FROM photos ${where}`,
    params,
  )) as any
  const [rows] = (await db().query(
    `SELECT p.*, (SELECT COUNT(*) FROM likes WHERE likes.photo_id = p.id) as like_count, (SELECT COUNT(*) FROM comments WHERE comments.photo_id = p.id) as comment_count FROM photos p ${where} ORDER BY taken_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, cursor],
  )) as any

  const data = (rows as any[]).map((r: any) => ({
    id: r.id,
    webpUrl: r.webp_url,
    thumbnailUrl: r.thumbnail_url,
    originalUrl: r.original_url,
    fileName: r.file_name,
    takenAt: r.taken_at,
    isVideo: !!r.is_video,
    videoUrl: r.video_url,
    latitude: r.latitude,
    longitude: r.longitude,
    locationName: r.location_name,
    cameraMake: r.camera_make,
    cameraModel: r.camera_model,
    width: r.width,
    height: r.height,
    fileSize: r.file_size,
    likeCount: r.like_count,
    commentCount: r.comment_count,
  }))

  return { data, total, nextCursor: cursor + limit < total ? cursor + limit : null }
})
