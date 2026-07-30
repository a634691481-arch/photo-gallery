export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],
  icon: {
    provider: 'iconify',
    mode: 'css',
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  runtimeConfig: {
    oss: {
      region: process.env.NUXT_OSS_REGION || '',
      accessKeyId: process.env.NUXT_OSS_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.NUXT_OSS_ACCESS_KEY_SECRET || '',
      bucket: process.env.NUXT_OSS_BUCKET || '',
      endpoint: process.env.NUXT_OSS_ENDPOINT || '',
    },
    supabase: {
      url: process.env.NUXT_SUPABASE_URL || '',
      anonKey: process.env.NUXT_SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '',
    },
    wechat: {
      appId: process.env.NUXT_WECHAT_APP_ID || '',
      appSecret: process.env.NUXT_WECHAT_APP_SECRET || '',
    },
    jwt: {
      secret: process.env.NUXT_JWT_SECRET || 'dev-secret-change-me',
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Home Album',
    },
  },
})
