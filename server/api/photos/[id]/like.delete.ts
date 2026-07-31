import { db, ensureDB } from '~~/server/utils/db'

let cachedUserId: string | null = null

async function getSystemUserId() {
  if (cachedUserId) return cachedUserId
  const [rows] = (await db().query('SELECT id FROM users ORDER BY created_at LIMIT 1')) as any
  cachedUserId = rows?.length ? rows[0].id : null
  return cachedUserId
}

// DELETE /api/photos/[id]/like - unfavorite a photo
export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const userId = await getSystemUserId()
  if (!userId) throw createError({ statusCode: 404, message: 'No user' })

  await db().execute('DELETE FROM likes WHERE photo_id = ? AND user_id = ?', [id, userId])
  return { success: true, liked: false }
})
