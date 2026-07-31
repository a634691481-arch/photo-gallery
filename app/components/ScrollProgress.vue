<template>
  <div
    class="fixed top-0 left-0 z-[var(--z-progress)] h-0.5 pointer-events-none transition-all duration-150"
    :style="{
      width: scrollProgress + '%',
      background:
        'linear-gradient(90deg, rgb(var(--color-accent)), rgb(var(--color-accent-light)))',
    }"
  />
</template>

<script setup lang="ts">
const scrollProgress = ref(0)

function update() {
  const h = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = h > 0 ? (window.scrollY / h) * 100 : 0
}

onMounted(() => window.addEventListener('scroll', update, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', update))
</script>
