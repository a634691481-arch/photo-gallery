<template>
  <nav
    v-if="months.length"
    class="hidden lg:flex fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 px-1.5 py-2.5 rounded-full bg-ink/60 backdrop-blur-xl border border-ink-soft/20 shadow-sm"
  >
    <button
      v-for="m in months"
      :key="m"
      class="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-300"
      :class="
        activeMonth === m
          ? 'bg-ink text-cream font-medium'
          : 'text-ink-muted hover:text-ink hover:bg-ink-soft/10'
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
