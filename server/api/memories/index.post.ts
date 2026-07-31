import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const body = await readBody(event)

  if (!body?.title?.trim() || !body?.date) {
    throw createError({ statusCode: 400, message: '标题和日期必填' })
  }

  const [userRows] = (await db().query('SELECT id FROM users LIMIT 1')) as any
  const userId = userRows.length ? userRows[0].id : crypto.randomUUID()

  const id = crypto.randomUUID()
  await db().execute(
    'INSERT INTO anniversaries (id, title, date, description, created_by) VALUES (?,?,?,?,?)',
    [id, body.title.trim(), body.date, body.description || null, userId],
  )
  return { id, title: body.title.trim() }
})
