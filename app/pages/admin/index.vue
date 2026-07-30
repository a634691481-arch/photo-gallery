<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="font-display text-2xl sm:text-3xl font-semibold">管理后台</h1>
            <p class="text-ink-muted text-sm mt-1">管理家庭相册</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">1,248</p>
            <p class="text-xs text-ink-muted mt-1">总照片数</p>
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">4.2 GB</p>
            <p class="text-xs text-ink-muted mt-1">已用存储</p>
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">{{ adminAlbums.length }}</p>
            <p class="text-xs text-ink-muted mt-1">相册数</p>
          </div>
        </div>

        <div class="flex gap-1 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="px-4 py-2 text-sm rounded-full transition-colors"
            :class="
              activeTab === tab
                ? 'bg-ink text-cream dark:bg-cream dark:text-ink'
                : 'text-ink-muted hover:text-ink'
            "
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div v-if="activeTab === '相册'" class="space-y-2">
          <div
            v-for="album in adminAlbums"
            :key="album.id"
            class="flex items-center gap-4 p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10"
          >
            <div class="w-12 h-12 rounded-lg bg-cream-dark/30 dark:bg-ink-soft/20 overflow-hidden">
              <img :src="album.cover" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ album.title }}</p>
              <p class="text-xs text-ink-muted">{{ album.photoCount }} 张照片</p>
            </div>
            <button
              class="px-3 py-1.5 text-xs rounded-full border border-cream-dark/40 dark:border-ink-soft/20 hover:border-ink transition-colors"
            >
              编辑
            </button>
            <button
              class="px-3 py-1.5 text-xs rounded-full border border-red-300 dark:border-red-800 text-red-500 hover:border-red-400 transition-colors"
            >
              删除
            </button>
          </div>
        </div>

        <div v-if="activeTab === '设置'" class="space-y-4">
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <label class="block text-sm font-medium mb-2">网站名称</label>
            <input
              v-model="siteName"
              type="text"
              class="w-full px-4 py-2 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <label class="block text-sm font-medium mb-2">首页标语</label>
            <input
              v-model="siteTagline"
              type="text"
              class="w-full px-4 py-2 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button
            class="px-6 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium hover:scale-105 transition-transform"
            @click="saveSettings"
          >
            保存设置
          </button>
          <p v-if="saved" class="text-xs text-green-500">设置已保存</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const tabs = ['相册', '设置']
const activeTab = ref('相册')

const siteName = ref('Home Album')
const siteTagline = ref('珍藏每一刻')
const saved = ref(false)

const saveSettings = () => {
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}

const adminAlbums = [
  {
    id: '1',
    title: '2026 暑假旅行',
    photoCount: 42,
    cover: 'https://picsum.photos/seed/aa1/200/200',
  },
  { id: '2', title: '宝宝第一步', photoCount: 18, cover: 'https://picsum.photos/seed/aa2/200/200' },
]
</script>
