// GET /api/auth/wechat - Generate QR code login URL
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const redirectUri = `${config.public.siteUrl}/api/auth/wechat/callback`
  const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString('base64')

  const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${config.wechat.appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`

  return { url, state }
})
