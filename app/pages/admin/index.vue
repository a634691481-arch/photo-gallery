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

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">1,248</p>
            <p class="text-xs text-ink-muted mt-1">总照片数</p>
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">4.2 GB</p>
            <p class="text-xs text-ink-muted mt-1">已用存储</p>
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">3</p>
            <p class="text-xs text-ink-muted mt-1">成员</p>
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">1</p>
            <p class="text-xs text-ink-muted mt-1">待审核</p>
          </div>
        </div>

        <div class="flex gap-1 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-2 text-sm rounded-full transition-colors"
            :class="activeTab === tab
              ? 'bg-ink text-cream dark:bg-cream dark:text-ink'
              : 'text-ink-muted hover:text-ink'"
          >
            {{ tab }}
          </button>
        </div>

        <div v-if="activeTab === '用户'" class="space-y-2">
          <div v-for="user in users" :key="user.id" class="flex items-center gap-4 p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <div class="w-10 h-10 rounded-full bg-cream-dark/30 dark:bg-ink-soft/20 overflow-hidden">
              <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ user.nickname }}</p>
              <p class="text-xs text-ink-muted">管理员</p>
            </div>
            <button v-if="user.role === 'pending'" class="px-3 py-1.5 text-xs rounded-full bg-ink text-cream dark:bg-cream dark:text-ink">通过</button>
            <button class="px-3 py-1.5 text-xs rounded-full border border-cream-dark/40 dark:border-ink-soft/20 hover:border-ink transition-colors">编辑</button>
          </div>
        </div>

        <div v-if="activeTab === '相册'" class="space-y-2">
          <div v-for="album in adminAlbums" :key="album.id" class="flex items-center gap-4 p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <div class="w-12 h-12 rounded-lg bg-cream-dark/30 dark:bg-ink-soft/20 overflow-hidden">
              <img :src="album.cover" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ album.title }}</p>
              <p class="text-xs text-ink-muted">{{ album.count }} 张照片</p>
            </div>
            <button class="px-3 py-1.5 text-xs rounded-full border border-cream-dark/40 dark:border-ink-soft/20 hover:border-ink transition-colors">编辑</button>
            <button class="px-3 py-1.5 text-xs rounded-full border border-red-300 dark:border-red-800 text-red-500 hover:border-red-400 transition-colors">删除</button>
          </div>
        </div>

        <div v-if="activeTab === '设置'" class="space-y-4">
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <label class="block text-sm font-medium mb-2">网站名称</label>
            <input type="text" value="家庭相册" class="w-full px-4 py-2 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm focus:outline-none focus:border-accent" />
          </div>
          <div class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <label class="block text-sm font-medium mb-2">回收站自动清空时间</label>
            <select class="w-full px-4 py-2 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm focus:outline-none">
              <option>30 天</option>
              <option>60 天</option>
              <option>90 天</option>
            </select>
          </div>
          <button class="px-6 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium hover:scale-105 transition-transform">
            保存设置
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const tabs = ['用户', '相册', '设置']
const activeTab = ref('用户')

const users = [
  { id: '1', nickname: '爸爸', role: 'admin', avatar: 'https://picsum.photos/seed/u1/100/100' },
  { id: '2', nickname: '妈妈', role: 'member', avatar: 'https://picsum.photos/seed/u2/100/100' },
  { id: '3', nickname: '李阿姨', role: 'pending', avatar: null },
]

const adminAlbums = [
  { id: '1', title: '2026 暑假旅行', count: 42, cover: 'https://picsum.photos/seed/aa1/200/200' },
  { id: '2', title: '宝宝第一步', count: 18, cover: 'https://picsum.photos/seed/aa2/200/200' },
]
</script>
