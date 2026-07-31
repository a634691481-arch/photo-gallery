import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const body = await readBody(event)
  if (!body.albumId) throw createError({ statusCode: 400 })
  const code = Math.random().toString(36).substring(2, 12)
  const expiresAt = new Date(Date.now() + 7 * 86400000)
  await db().execute(
    'INSERT INTO share_links (id, album_id, code, password, expires_at, created_by) VALUES (?,?,?,?,?,?)',
    [
      crypto.randomUUID(),
      body.albumId,
      code,
      body.password || null,
      expiresAt,
      body.userId || 'default',
    ],
  )
  return { code, url: `/s/${code}`, expiresAt: expiresAt.toISOString() }
})
