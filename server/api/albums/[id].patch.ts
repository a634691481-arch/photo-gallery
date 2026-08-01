import { db, ensureDB } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  await ensureDB()
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const [albumRows] = (await db().query('SELECT id FROM albums WHERE id = ?', [id])) as any
  if (!albumRows.length) throw createError({ statusCode: 404, message: 'Album not found' })

  if (body.photoId) {
    const [photoRows] = (await db().query('SELECT webp_url FROM photos WHERE id = ?', [
      body.photoId,
    ])) as any
    if (!photoRows.length) throw createError({ statusCode: 404, message: 'Photo not found' })

    await db().execute('UPDATE albums SET cover_url = ? WHERE id = ?', [photoRows[0].webp_url, id])
    return { success: true }
  }

  const title = typeof body.title === 'string' ? body.title.trim() : undefined
  if (title !== undefined && !title) {
    throw createError({ statusCode: 400, message: 'title required' })
  }
  if (title === undefined && body.description === undefined) {
    throw createError({ statusCode: 400, message: 'nothing to update' })
  }

  const fields: string[] = []
  const values: any[] = []
  if (title !== undefined) {
    fields.push('title = ?')
    values.push(title)
  }
  if (body.description !== undefined) {
    fields.push('description = ?')
    values.push(body.description ?? null)
  }
  values.push(id)
  await db().execute(`UPDATE albums SET ${fields.join(', ')} WHERE id = ?`, values)
  return { success: true }
})
