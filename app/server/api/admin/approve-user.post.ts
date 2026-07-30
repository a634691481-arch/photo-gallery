// POST /api/admin/approve-user - Approve a pending user
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body

  if (!userId) {
    throw createError({ statusCode: 400, message: 'userId is required' })
  }

  // TODO: Update user role from 'pending' to 'member' in database
  // TODO: Send notification to the approved user

  return { success: true, message: 'User approved' }
})
