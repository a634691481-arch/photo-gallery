export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  icon: {
    provider: 'iconify',
    mode: 'css',
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '家庭相册',
      titleTemplate: '%s · 家庭相册',
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        ...(() => {
          const bucket = process.env.NUXT_OSS_BUCKET
          const region = process.env.NUXT_OSS_REGION
          return bucket && region
            ? [
                {
                  rel: 'preconnect',
                  href: `https://${bucket}.${region}.aliyuncs.com`,
                  crossorigin: '',
                },
              ]
            : []
        })(),
      ],
      meta: [
        { name: 'theme-color', content: '#FDFBF7' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#12100E' },
        {
          name: 'description',
          content: '一个属于我们家庭的私密相册，记录成长，留住时光。',
        },
        { property: 'og:title', content: '家庭相册' },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:description',
          content: '一个属于我们家庭的私密相册，记录成长，留住时光。',
        },
      ],
    },
  },
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
