import { db, ensureDB } from '~~/server/utils/db'

let cachedUserId: string | null = null

async function getSystemUserId() {
  if (cachedUserId) return cachedUserId
  const [rows] = (await db().query('SELECT id FROM users ORDER BY created_at LIMIT 1')) as any
  cachedUserId = rows?.length ? rows[0].id : null
  return cachedUserId
}

// POST /api/photos/[id]/like - favorite a photo
export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const userId = await getSystemUserId()
  if (!userId) throw createError({ statusCode: 404, message: 'No user' })

  const [photos] = (await db().query('SELECT id FROM photos WHERE id = ?', [id])) as any
  if (!photos.length) throw createError({ statusCode: 404, message: 'Photo not found' })

  await db().execute('INSERT IGNORE INTO likes (id, photo_id, user_id) VALUES (?, ?, ?)', [
    crypto.randomUUID(),
    id,
    userId,
  ])
  return { success: true, liked: true }
})
