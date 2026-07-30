export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const config = useRuntimeConfig()

  if (password === config.familyPassword) {
    setCookie(event, 'family_auth', '1', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return { success: true }
  }

  throw createError({ statusCode: 401, message: '密码错误' })
})
