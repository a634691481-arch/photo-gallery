<template>
  <nav
    class="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full border border-ink-soft/20 bg-ink/60 backdrop-blur-xl shadow-sm"
  >
    <div class="flex items-center gap-1">
      <NuxtLink
        to="/"
        active-class=""
        class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-colors hover:bg-ink-soft/10"
      >
        <span class="font-display text-sm sm:text-base font-semibold tracking-tight text-ink">
          家庭相册
        </span>
      </NuxtLink>

      <div class="hidden md:flex items-center">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-300 text-ink-muted hover:text-ink hover:bg-ink-soft/10"
          active-class="!text-ink !bg-ink-soft/20"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-1 ml-2 sm:ml-4">
        <NuxtLink
          to="/upload"
          class="px-4 py-2 rounded-full bg-ink text-cream text-xs sm:text-sm font-medium transition-all duration-500 hover:scale-105 active:scale-95"
        >
          上传照片
        </NuxtLink>

        <button
          class="md:hidden p-2.5 rounded-full transition-colors hover:bg-ink-soft/10"
          aria-label="菜单"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'ph-x' : 'heroicons:bars-3'" class="size-4 text-ink-soft" />
        </button>
      </div>
    </div>

    <div
      v-if="mobileOpen"
      class="md:hidden mt-3 pt-3 border-t border-ink-soft/10 flex flex-col gap-1"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="px-3 py-2 text-sm rounded-full transition-colors text-ink-muted hover:text-ink hover:bg-ink-soft/10"
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

const links = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },
  { to: '/people', label: '人物' },
  { to: '/map', label: '足迹' },
  { to: '/search', label: '搜索' },
]
</script>
