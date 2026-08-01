<template>
  <main class="overflow-x-hidden w-full max-w-full min-h-screen relative">
    <a
      href="#content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-skip)] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-cream focus:text-sm focus:font-medium"
    >
      跳到内容
    </a>
    <div class="grain-overlay" aria-hidden="true" />
    <ParticleBg />
    <ScrollProgress />
    <Navbar />
    <slot />
    <Footer />
    <BackToTop />
    <Toast />
  </main>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()
const toast = useToast()

watch(
  () => $pwa?.offlineReady,
  (v) => {
    if (v) toast.success('已可离线使用')
  },
)
</script>
