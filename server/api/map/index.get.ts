import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query(
    'SELECT location_name, latitude, longitude, COUNT(*) as count FROM photos WHERE location_name IS NOT NULL AND deleted_at IS NULL GROUP BY location_name, latitude, longitude ORDER BY count DESC',
  )) as any
  return (rows as any[]).map((r: any) => ({
    name: r.location_name,
    lat: r.latitude,
    lng: r.longitude,
    count: r.count,
  }))
})
