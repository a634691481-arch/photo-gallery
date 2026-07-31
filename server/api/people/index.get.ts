import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query(
    'SELECT fl.*, (SELECT COUNT(*) FROM detected_faces df WHERE df.face_label_id = fl.id) as photo_count FROM face_labels fl ORDER BY fl.created_at',
  )) as any
  return (rows as any[]).map((r: any) => ({ id: r.id, name: r.name, photoCount: r.photo_count }))
})
