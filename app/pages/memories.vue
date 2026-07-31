<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          纪念日与回忆
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">
          家庭的重要日子与提醒，不错过任何一个特别的时刻。
        </p>
      </div>
    </section>
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <div v-else class="space-y-3">
          <div
            v-for="item in anniversaries"
            :key="item.id"
            class="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-ink-soft/10 hover:bg-ink-soft/20 transition-colors group cursor-pointer"
          >
            <div
              class="w-12 h-12 rounded-xl bg-ink-soft/20 flex items-center justify-center shrink-0"
            >
              <span class="font-display text-lg font-semibold">{{ item.day }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-display font-medium text-sm">{{ item.title }}</p>
              <p class="text-xs text-ink-muted mt-0.5">
                {{ item.month }}月{{ item.year ? ' ' + item.year : '' }}
                <span
                  v-if="item.age"
                  class="ml-2 px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs"
                  >{{ item.age }} 岁</span
                >
              </p>
            </div>
            <span
              v-if="item.comingSoon"
              class="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >还有 {{ item.daysLeft }} 天</span
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { data, pending } = useFetch('/api/memories')
const anniversaries = computed(() => data.value ?? [])
</script>
