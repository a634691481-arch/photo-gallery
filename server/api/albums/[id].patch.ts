import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const { photoId } = await readBody(event)
  if (!photoId) throw createError({ statusCode: 400, message: 'photoId required' })

  const [albumRows] = (await db().query('SELECT id FROM albums WHERE id = ?', [id])) as any
  if (!albumRows.length) throw createError({ statusCode: 404, message: 'Album not found' })

  const [photoRows] = (await db().query('SELECT webp_url FROM photos WHERE id = ?', [
    photoId,
  ])) as any
  if (!photoRows.length) throw createError({ statusCode: 404, message: 'Photo not found' })

  await db().execute('UPDATE albums SET cover_url = ? WHERE id = ?', [photoRows[0].webp_url, id])
  return { success: true }
})
