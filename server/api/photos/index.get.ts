import { db, ensureDB } from '~~/server/utils/db'
import { withPhotoUrls } from '~~/server/utils/photo'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const query = getQuery(event)
  const cursor = parseInt((query.cursor as string) || '0')
  const limit = Math.min(parseInt((query.limit as string) || '30'), 100)
  const year = query.year as string | undefined
  const month = query.month as string | undefined
  const favorites = query.favorites === '1'

  let where = 'WHERE deleted_at IS NULL'
  const params: any[] = []

  if (favorites) {
    where += ' AND p.id IN (SELECT photo_id FROM likes)'
  }

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
    `SELECT COUNT(*) as total FROM photos p ${where}`,
    params,
  )) as any
  const [rows] = (await db().query(
    `SELECT p.*, (SELECT COUNT(*) FROM likes WHERE likes.photo_id = p.id) as like_count, (SELECT COUNT(*) FROM comments WHERE comments.photo_id = p.id) as comment_count FROM photos p ${where} ORDER BY taken_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, cursor],
  )) as any

  const data = (rows as any[]).map((r: any) => {
    const p = withPhotoUrls(r)
    return {
      id: p.id,
      webpUrl: p.webpUrl,
      thumbnailUrl: p.thumbnailUrl,
      originalUrl: p.originalUrl,
      fileName: p.fileName,
      takenAt: p.takenAt,
      isVideo: p.isVideo,
      videoUrl: p.videoUrl,
      latitude: p.latitude,
      longitude: p.longitude,
      locationName: p.locationName,
      cameraMake: p.cameraMake,
      cameraModel: p.cameraModel,
      width: p.width,
      height: p.height,
      aspectRatio: p.aspectRatio,
      fileSize: p.fileSize,
      likeCount: p.likeCount,
      commentCount: p.commentCount,
      liked: (p.likeCount ?? 0) > 0,
    }
  })

  return { data, total, nextCursor: cursor + limit < total ? cursor + limit : null }
})
