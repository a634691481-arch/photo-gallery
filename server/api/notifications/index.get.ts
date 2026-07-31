import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [notifRows] = (await db().query(
    'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20',
  )) as any
  const [unreadRows] = (await db().query(
    'SELECT COUNT(*) as cnt FROM notifications WHERE `read` = 0',
  )) as any
  return {
    data: (notifRows as any[]).map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      read: !!n.read,
      createdAt: n.created_at,
    })),
    unread: unreadRows[0].cnt,
  }
})
