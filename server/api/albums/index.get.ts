import { db, ensureDB } from '~~/server/utils/db'
import { withPhotoUrls } from '~~/server/utils/photo'

export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query(
    'SELECT a.*, (SELECT COUNT(*) FROM album_photos ap WHERE ap.album_id = a.id) as photo_count FROM albums a ORDER BY a.created_at DESC',
  )) as any
  return (rows as any[]).map((r: any) => {
    const a = withPhotoUrls(r)
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      coverUrl: a.coverUrl,
      photoCount: a.photoCount,
      createdAt: a.createdAt,
    }
  })
})
