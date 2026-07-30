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
      <div class="max-w-2xl mx-auto space-y-3">
        <div
          v-for="item in anniversaries"
          :key="item.id"
          class="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10 hover:bg-cream-dark/30 dark:hover:bg-ink-soft/20 transition-colors group cursor-pointer"
        >
          <div
            class="w-12 h-12 rounded-xl bg-cream-dark/30 dark:bg-ink-soft/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors"
          >
            <span class="font-display text-lg font-semibold">{{ item.day }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-display font-medium text-sm">{{ item.title }}</p>
            <p class="text-xs text-ink-muted mt-0.5">
              {{ item.month }}{{ item.year ? ' ' + item.year : '' }}
              <span
                v-if="item.age"
                class="ml-2 px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs"
              >
                {{ item.age }} 岁
              </span>
            </p>
          </div>
          <span
            v-if="item.comingSoon"
            class="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
          >
            还有 {{ item.daysLeft }} 天
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const anniversaries = [
  {
    id: '1',
    title: '宝宝 Emma 生日',
    month: '3 月',
    day: '15',
    year: '2022',
    age: '4',
    comingSoon: false,
  },
  {
    id: '2',
    title: '结婚纪念日',
    month: '8 月',
    day: '8',
    year: '2019',
    age: '7',
    comingSoon: true,
    daysLeft: '9',
  },
  { id: '3', title: '宝宝迈出第一步', month: '10 月', day: '3', year: '2022', comingSoon: false },
  { id: '4', title: '搬进新家', month: '6 月', day: '20', year: '2024', comingSoon: false },
  { id: '5', title: '爸爸生日', month: '11 月', day: '28', comingSoon: false },
]
</script>
