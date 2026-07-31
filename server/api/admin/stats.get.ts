import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [[{ photos }]] = (await db().query(
    'SELECT COUNT(*) as photos FROM photos WHERE deleted_at IS NULL',
  )) as any
  const [[{ albums }]] = (await db().query('SELECT COUNT(*) as albums FROM albums')) as any
  const [[{ members }]] = (await db().query('SELECT COUNT(*) as members FROM users')) as any
  return { photos, albums, members, pending: 0 }
})
