import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const body = await readBody(event)

  const [userRows] = (await db().query('SELECT id FROM users LIMIT 1')) as any
  const userId = userRows.length ? userRows[0].id : crypto.randomUUID()

  const album = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description || null,
    cover_url: `https://picsum.photos/seed/alb${Date.now()}/800/600`,
    created_by: userId,
    created_at: new Date().toISOString(),
  }
  await db().execute(
    'INSERT INTO albums (id, title, description, cover_url, created_by) VALUES (?,?,?,?,?)',
    [album.id, album.title, album.description, album.cover_url, album.created_by],
  )
  return { id: album.id, title: album.title }
})
