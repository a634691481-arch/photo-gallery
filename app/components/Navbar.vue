<template>
  <nav
    class="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-6 sm:px-2 py-1.5 sm:py-2 rounded-full border border-ink-soft/20 backdrop-blur-xl shadow-sm"
  >
    <div class="flex items-center gap-0.5 sm:gap-1 flex-nowrap">
      <NuxtLink
        to="/"
        active-class=""
        class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors hover:bg-ink-soft/10 whitespace-nowrap"
      >
        <span class="font-display text-sm sm:text-base font-semibold tracking-tight text-ink">
          家庭相册
        </span>
      </NuxtLink>

      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-300 text-ink-muted hover:text-ink hover:bg-ink-soft/10 whitespace-nowrap"
        active-class="!text-ink !bg-ink-soft/20"
      >
        {{ link.label }}
      </NuxtLink>

      <NuxtLink
        to="/upload"
        class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ink text-cream text-xs sm:text-sm font-medium transition-all duration-500 hover:scale-105 active:scale-95 whitespace-nowrap"
      >
        上传照片
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },
  { to: '/favorites', label: '收藏' },
]
</script>
