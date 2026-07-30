<template>
  <div class="overflow-x-hidden w-full max-w-full min-h-screen relative">
    <a
      href="#content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-cream focus:text-sm focus:font-medium"
    >
      跳到内容
    </a>
    <ParticleBg />
    <ScrollProgress />
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>
