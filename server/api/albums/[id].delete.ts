import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const [rows] = (await db().query('SELECT id FROM albums WHERE id = ?', [id])) as any
  if (!rows.length) throw createError({ statusCode: 404, message: 'Album not found' })

  await db().execute('DELETE FROM albums WHERE id = ?', [id])
  return { success: true }
})
