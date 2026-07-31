import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const [labelRows] = (await db().query('SELECT * FROM face_labels WHERE id = ?', [id])) as any
  if (!labelRows.length) throw createError({ statusCode: 404 })
  const [photoRows] = (await db().query(
    'SELECT p.id, p.webp_url, p.thumbnail_url, p.file_name, p.taken_at, p.is_video FROM photos p JOIN detected_faces df ON df.photo_id = p.id WHERE df.face_label_id = ? ORDER BY p.taken_at DESC',
    [id],
  )) as any
  return {
    id: labelRows[0].id,
    name: labelRows[0].name,
    photos: (photoRows as any[]).map((p: any) => ({
      id: p.id,
      webpUrl: p.webp_url,
      thumbnailUrl: p.thumbnail_url,
      fileName: p.file_name,
      takenAt: p.taken_at,
      isVideo: !!p.is_video,
    })),
  }
})
