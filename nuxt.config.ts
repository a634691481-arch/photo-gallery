export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
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
    familyPassword: process.env.FAMILY_PASSWORD || 'changeme123',
    oss: {
      region: process.env.NUXT_OSS_REGION || '',
      accessKeyId: process.env.NUXT_OSS_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.NUXT_OSS_ACCESS_KEY_SECRET || '',
      bucket: process.env.NUXT_OSS_BUCKET || '',
      endpoint: process.env.NUXT_OSS_ENDPOINT || '',
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Home Album',
      siteTagline: '珍藏每一刻',
    },
  },
})
