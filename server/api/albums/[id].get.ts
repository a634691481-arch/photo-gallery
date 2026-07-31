import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const [albumRows] = (await db().query('SELECT * FROM albums WHERE id = ?', [id])) as any
  if (!albumRows.length) throw createError({ statusCode: 404, message: 'not found' })
  const album = albumRows[0]

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
    coverUrl: album.cover_url,
    photoCount: total,
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
