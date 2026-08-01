export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@vite-pwa/nuxt', '@nuxt/image', '@nuxtjs/robots'],
  image: {
    ipx: {
      domains: [
        'picsum.photos',
        ...(process.env.NUXT_OSS_BUCKET && process.env.NUXT_OSS_REGION
          ? [`${process.env.NUXT_OSS_BUCKET}.${process.env.NUXT_OSS_REGION}.aliyuncs.com`]
          : []),
      ],
    },
  },
  robots: {
    disallow: ['/'],
  },
  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: '家庭相册',
      short_name: '家庭相册',
      description: '一个属于我们家庭的私密相册，记录成长，留住时光。',
      lang: 'zh-CN',
      theme_color: '#FDFBF7',
      background_color: '#FDFBF7',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },
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
    externals: {
      external: ['ali-oss'],
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
      watermarkText: '家庭相册',
    },
  },
})
