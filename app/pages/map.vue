<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我们的足迹
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">
          我们一起走过的每个地方，都从照片中提取了位置。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-6xl mx-auto">
        <EmptyState text="地图将在连接数据后显示照片位置" variant="card" />

        <div class="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="loc in locations"
            :key="loc.name"
            class="p-4 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10 hover:bg-cream-dark/30 dark:hover:bg-ink-soft/20 transition-colors cursor-pointer"
          >
            <p class="font-display font-medium text-sm">{{ loc.name }}</p>
            <p class="text-xs text-ink-muted mt-1">{{ loc.count }} 张照片</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const locations = [
  { name: '北京', count: 45 },
  { name: '上海', count: 32 },
  { name: '杭州', count: 28 },
  { name: '三亚', count: 67 },
  { name: '成都', count: 19 },
  { name: '昆明', count: 14 },
  { name: '桂林', count: 22 },
  { name: '厦门', count: 11 },
]
</script>
