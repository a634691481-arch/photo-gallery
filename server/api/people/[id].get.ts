import { db, ensureDB } from '~~/server/utils/db'
import { withPhotoUrls } from '~~/server/utils/photo'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const [labelRows] = (await db().query('SELECT * FROM face_labels WHERE id = ?', [id])) as any
  if (!labelRows.length) throw createError({ statusCode: 404 })
  const [photoRows] = (await db().query(
    'SELECT p.* FROM photos p JOIN detected_faces df ON df.photo_id = p.id WHERE df.face_label_id = ? ORDER BY p.taken_at DESC',
    [id],
  )) as any
  return {
    id: labelRows[0].id,
    name: labelRows[0].name,
    photos: (photoRows as any[]).map((r: any) => {
      const p = withPhotoUrls(r)
      return {
        id: p.id,
        webpUrl: p.webpUrl,
        thumbnailUrl: p.thumbnailUrl,
        fileName: p.fileName,
        takenAt: p.takenAt,
        isVideo: p.isVideo,
      }
    }),
  }
})
