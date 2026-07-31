import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const { ids, albumId } = await readBody(event)
  if (!Array.isArray(ids) || !ids.length) {
    throw createError({ statusCode: 400, message: 'ids required' })
  }
  if (!albumId) throw createError({ statusCode: 400, message: 'albumId required' })

  const [albums] = (await db().query('SELECT id FROM albums WHERE id = ?', [albumId])) as any
  if (!albums.length) throw createError({ statusCode: 404, message: 'Album not found' })

  for (const id of ids) {
    await db().execute('INSERT IGNORE INTO album_photos (album_id, photo_id) VALUES (?, ?)', [
      albumId,
      id,
    ])
  }
  return { success: true, moved: ids.length }
})
