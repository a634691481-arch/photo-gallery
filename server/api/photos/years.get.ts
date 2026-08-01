import { db, ensureDB } from '~~/server/utils/db'

// GET /api/photos/years - distinct capture years for timeline filtering
export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query(
    `SELECT DISTINCT YEAR(taken_at) AS year FROM photos WHERE deleted_at IS NULL AND taken_at IS NOT NULL ORDER BY year DESC`,
  )) as any
  return rows.map((r: any) => Number(r.year))
})
