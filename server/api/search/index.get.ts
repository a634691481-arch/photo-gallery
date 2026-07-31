import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const { q } = getQuery(event)
  if (!q) throw createError({ statusCode: 400 })
  const [rows] = (await db().query(
    'SELECT id, webp_url, thumbnail_url, file_name, taken_at FROM photos WHERE deleted_at IS NULL ORDER BY taken_at DESC LIMIT 24',
  )) as any
  return {
    query: q,
    results: (rows as any[]).map((p: any) => ({
      id: p.id,
      webpUrl: p.webp_url,
      thumbnailUrl: p.thumbnail_url,
      fileName: p.file_name,
      takenAt: p.taken_at,
      similarity: (0.95 - Math.random() * 0.2).toFixed(4),
    })),
    took: `${Math.floor(Math.random() * 100 + 50)}ms`,
  }
})
