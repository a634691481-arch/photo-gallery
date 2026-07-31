<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-soft"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-500 ease-soft"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-show="visible"
      type="button"
      aria-label="回到顶部"
      class="fixed bottom-6 right-6 z-[var(--z-float)] size-11 rounded-full ring-1 ring-ink-soft/10 bg-ink/60 backdrop-blur-xl text-cream/80 hover:text-cream hover:bg-ink/75 shadow-soft transition-all duration-500 ease-soft hover:scale-105 active:scale-95 flex items-center justify-center"
      @click="scrollToTop"
    >
      <Icon name="heroicons:arrow-up" class="size-4" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(false)
const suppressAutoCenter = useState('nav:suppressAutoCenter', () => false)

const onScroll = () => {
  visible.value = window.scrollY > 400
}

const scrollToTop = () => {
  suppressAutoCenter.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => (suppressAutoCenter.value = false), 1200)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
