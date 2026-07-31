import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query(
    'SELECT a.*, (SELECT COUNT(*) FROM album_photos ap WHERE ap.album_id = a.id) as photo_count FROM albums a ORDER BY a.created_at DESC',
  )) as any
  return (rows as any[]).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    coverUrl: r.cover_url,
    photoCount: r.photo_count,
    createdAt: r.created_at,
  }))
})
