import { db, ensureDB } from '~~/server/utils/db'
import { withPhotoUrls } from '~~/server/utils/photo'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const [albumRows] = (await db().query('SELECT * FROM albums WHERE id = ?', [id])) as any
  if (!albumRows.length) throw createError({ statusCode: 404, message: 'not found' })
  const album = withPhotoUrls(albumRows[0])

  const [[{ total }]] = (await db().query(
    'SELECT COUNT(*) as total FROM album_photos WHERE album_id = ?',
    [id],
  )) as any
  const [photoRows] = (await db().query(
    'SELECT p.* FROM photos p JOIN album_photos ap ON ap.photo_id = p.id WHERE ap.album_id = ? ORDER BY ap.added_at DESC',
    [id],
  )) as any

  return {
    id: album.id,
    title: album.title,
    description: album.description,
    coverUrl: album.coverUrl,
    photoCount: total,
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
