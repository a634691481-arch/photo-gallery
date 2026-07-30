export default defineEventHandler((event) => {
  deleteCookie(event, 'family_auth', { path: '/' })
  return { success: true }
})
