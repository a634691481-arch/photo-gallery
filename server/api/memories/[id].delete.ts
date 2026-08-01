import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: '缺少纪念日 ID' })
  }

  const [rows] = (await db().query('SELECT id FROM anniversaries WHERE id = ?', [id])) as any
  if (!rows.length) {
    throw createError({ statusCode: 404, message: '纪念日不存在' })
  }

  await db().execute('DELETE FROM anniversaries WHERE id = ?', [id])
  return { success: true }
})
