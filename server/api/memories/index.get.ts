import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  await ensureDB()
  const [rows] = (await db().query('SELECT * FROM anniversaries ORDER BY date')) as any
  const now = new Date()
  return (rows as any[]).map((r: any) => {
    const d = new Date(r.date)
    const age = now.getFullYear() - d.getFullYear()
    const nextDate = new Date(now.getFullYear(), d.getMonth(), d.getDate())
    if (nextDate < now) nextDate.setFullYear(nextDate.getFullYear() + 1)
    const daysLeft = Math.ceil((nextDate.getTime() - now.getTime()) / 86400000)
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      month: d.getMonth() + 1,
      day: d.getDate(),
      year: d.getFullYear(),
      age: age > 0 ? age : null,
      daysLeft: daysLeft <= 30 ? daysLeft : null,
      comingSoon: daysLeft <= 30,
    }
  })
})
