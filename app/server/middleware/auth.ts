// Auth middleware - protects routes that require login
export default defineEventHandler((event) => {
  const publicPaths = ['/api/auth/wechat', '/api/share']

  if (publicPaths.some(p => event.path.startsWith(p))) {
    return
  }

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    || getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  // TODO: Verify JWT token
  // TODO: Set event.context.user with the decoded user info
  event.context.user = { id: 'user-1', role: 'member' }
})
