// POST /api/share - Create a share link
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { albumId } = body

  if (!albumId) {
    throw createError({ statusCode: 400, message: 'albumId is required' })
  }

  // TODO: Create share link record in database
  // Generate random code, hash password, set expiration
  const code = Math.random().toString(36).substring(2, 12)

  return {
    code,
    url: `/s/${code}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
})
