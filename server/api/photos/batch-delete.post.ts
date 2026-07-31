import { db, ensureDB } from '~~/server/utils/db'
import { deleteFromOSS } from '~~/server/utils/oss'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const { ids } = await readBody(event)
  if (!Array.isArray(ids) || !ids.length) {
    throw createError({ statusCode: 400, message: 'ids required' })
  }

  // 1. Delete OSS objects (only OSS keys; skip external/local URLs)
  const [rows] = (await db().query(
    'SELECT original_url, webp_url, thumbnail_url FROM photos WHERE id IN (?)',
    [ids],
  )) as any
  const keys = new Set<string>()
  for (const r of rows) {
    for (const key of [r.original_url, r.webp_url, r.thumbnail_url]) {
      if (key && !key.startsWith('http') && !key.startsWith('/')) keys.add(key)
    }
  }
  for (const key of keys) {
    try {
      await deleteFromOSS(key)
    } catch {
      // ignore missing objects
    }
  }

  // 2. Hard delete DB rows (FK cascade cleans album_photos / faces / comments)
  const [res] = (await db().query('DELETE FROM photos WHERE id IN (?)', [ids])) as any

  return { success: true, deleted: res.affectedRows ?? ids.length }
})
