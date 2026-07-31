import { db, ensureDB } from '~~/server/utils/db'

// Move photos from this album to another album (replace assignment)
export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const { ids, targetAlbumId } = await readBody(event)
  if (!Array.isArray(ids) || !ids.length) {
    throw createError({ statusCode: 400, message: 'ids required' })
  }
  if (!targetAlbumId) throw createError({ statusCode: 400, message: 'targetAlbumId required' })
  if (targetAlbumId === id)
    throw createError({ statusCode: 400, message: 'Cannot move to same album' })

  const [albums] = (await db().query('SELECT id FROM albums WHERE id = ?', [targetAlbumId])) as any
  if (!albums.length) throw createError({ statusCode: 404, message: 'Album not found' })

  // Add to target album, then remove from current album
  for (const pid of ids) {
    await db().execute('INSERT IGNORE INTO album_photos (album_id, photo_id) VALUES (?, ?)', [
      targetAlbumId,
      pid,
    ])
  }
  await db().query('DELETE FROM album_photos WHERE album_id = ? AND photo_id IN (?)', [id, ids])

  return { success: true, moved: ids.length }
})
