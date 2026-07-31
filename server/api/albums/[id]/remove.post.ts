import { db, ensureDB } from '~~/server/utils/db'

// Remove photos from this album (photos stay in timeline)
export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const { ids } = await readBody(event)
  if (!Array.isArray(ids) || !ids.length) {
    throw createError({ statusCode: 400, message: 'ids required' })
  }

  const [res] = (await db().query(
    'DELETE FROM album_photos WHERE album_id = ? AND photo_id IN (?)',
    [id, ids],
  )) as any

  return { success: true, removed: res.affectedRows ?? ids.length }
})
