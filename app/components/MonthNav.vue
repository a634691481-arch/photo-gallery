<template>
  <nav
    v-if="months.length"
    class="hidden lg:flex fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-0.5 px-2 py-3 rounded-2xl bg-cream-dark/80 backdrop-blur-2xl border border-ink-soft/10"
  >
    <button
      v-for="m in months"
      :key="m"
      class="relative px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-300 ease-out"
      :class="
        activeMonth === m
          ? 'text-cream bg-accent font-medium shadow-sm'
          : 'text-ink-muted hover:text-ink-soft hover:bg-ink-soft/10'
      "
      @click="scrollToMonth(m)"
    >
      {{ m }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ months: string[] }>()

const activeMonth = ref('')
let observer: IntersectionObserver | null = null

const scrollToMonth = (label: string) => {
  const el = document.querySelector<HTMLElement>(`.month-group[data-label="${CSS.escape(label)}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const setupObserver = () => {
  observer?.disconnect()
  const groups = document.querySelectorAll<HTMLElement>('.month-group')
  if (!groups.length) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeMonth.value = (e.target as HTMLElement).dataset.label || ''
      }
    },
    { rootMargin: '-15% 0px -70% 0px' },
  )
  groups.forEach((g) => observer?.observe(g))
}

watch(
  () => props.months,
  () => {
    nextTick(setupObserver)
  },
  { immediate: true },
)

onBeforeUnmount(() => observer?.disconnect())
</script>
