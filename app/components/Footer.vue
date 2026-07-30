<template>
  <footer class="relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div class="md:col-span-5">
          <span class="font-display text-xl font-semibold tracking-tight block mb-4">
            家庭相册
          </span>
          <p class="text-ink-muted text-sm leading-relaxed max-w-xs">
            每个瞬间都值得被珍藏。一个属于我们家庭的私密空间，共同记录成长。
          </p>
        </div>

        <div v-for="group in linkGroups" :key="group.title" class="md:col-span-2">
          <span
            class="text-xs font-semibold uppercase tracking-widest text-ink-muted/70 mb-4 block"
          >
            {{ group.title }}
          </span>
          <ul class="space-y-2">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-sm text-ink-soft hover:text-ink transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="md:col-span-3 flex flex-col items-start">
          <NuxtLink
            to="/upload"
            class="px-8 py-3 rounded-full bg-ink text-cream font-display font-medium text-sm transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            上传回忆
          </NuxtLink>
          <p class="mt-3 text-xs text-ink-muted">私密、安全、永久保存。</p>
        </div>
      </div>

      <div class="mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-ink-muted/60">
          &copy; {{ new Date().getFullYear() }} 家庭相册。仅限家人。
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const linkGroups = [
  {
    title: '浏览',
    links: [
      { label: '时间线', to: '/' },
      { label: '相册', to: '/albums' },
      { label: '人物', to: '/people' },
    ],
  },
  {
    title: '发现',
    links: [
      { label: '足迹', to: '/map' },
      { label: '纪念日', to: '/memories' },
      { label: '搜索', to: '/search' },
    ],
  },
]
</script>
