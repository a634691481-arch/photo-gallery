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
      @click="onNavClick(m)"
    >
      {{ m }}
    </button>
  </nav>

  <nav v-if="months.length" class="lg:hidden fixed bottom-6 left-4 right-20 z-40">
    <div
      class="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 py-2 rounded-full bg-cream-dark/85 backdrop-blur-2xl border border-ink-soft/10 shadow-lg"
    >
      <button
        v-for="m in months"
        :key="m"
        class="relative shrink-0 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-300 ease-out"
        :class="
          activeMonth === m
            ? 'text-cream bg-accent font-medium shadow-sm'
            : 'text-ink-muted hover:text-ink-soft hover:bg-ink-soft/10'
        "
        @click="onNavClick(m)"
      >
        {{ m }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ months: string[] }>()

const activeMonth = ref('')
const suppressAutoCenter = useState('nav:suppressAutoCenter', () => false)
let observer: IntersectionObserver | null = null
let autoScrolling = false
let autoScrollTimer: ReturnType<typeof setTimeout> | null = null

const scrollToMonth = (label: string) => {
  const el = document.querySelector<HTMLElement>(`.month-group[data-label="${CSS.escape(label)}"]`)
  if (!el || autoScrolling) return
  autoScrolling = true
  if (autoScrollTimer) clearTimeout(autoScrollTimer)
  const r = el.getBoundingClientRect()
  const navHeight = window.innerWidth < 1024 ? 64 : 0
  const target = r.top + window.scrollY + r.height / 2 - (window.innerHeight - navHeight) / 2
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: Math.min(Math.max(target, 0), max), behavior: 'smooth' })
  autoScrollTimer = setTimeout(() => {
    autoScrolling = false
  }, 800)
}

const onNavClick = (label: string) => {
  if (autoScrollTimer) clearTimeout(autoScrollTimer)
  autoScrolling = false
  scrollToMonth(label)
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
    { rootMargin: '-40% 0px -40% 0px' },
  )
  groups.forEach((g) => observer?.observe(g))
}

watch(activeMonth, (label) => {
  if (!label) return
  if (suppressAutoCenter.value) return
  if (autoScrolling) return
  if (window.scrollY < window.innerHeight * 0.5) return
  scrollToMonth(label)
})

watch(
  () => props.months,
  () => {
    if (!import.meta.client) return
    nextTick(setupObserver)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  observer?.disconnect()
  if (autoScrollTimer) clearTimeout(autoScrollTimer)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
