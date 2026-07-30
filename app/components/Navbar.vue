<template>
  <nav
    class="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full border border-ink-soft/20 bg-ink/60 backdrop-blur-xl shadow-sm"
  >
    <div class="flex items-center gap-1">
      <NuxtLink to="/" class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-colors hover:bg-ink-soft/10">
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
        <button
          v-if="user"
          class="relative p-2.5 rounded-full transition-colors hover:bg-ink-soft/10"
          aria-label="通知"
          @click="showNotifications = !showNotifications"
        >
          <Icon name="ph-bell" class="size-4 text-ink-soft" />
          <span v-if="unreadCount" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        <NuxtLink
          v-if="user"
          to="/upload"
          class="px-4 py-2 rounded-full bg-ink text-cream text-xs sm:text-sm font-medium transition-all duration-500 hover:scale-105 active:scale-95"
        >
          上传照片
        </NuxtLink>

        <button
          v-if="!user"
          @click="navigateTo('/login')"
          class="px-4 py-2 rounded-full bg-ink text-cream text-xs sm:text-sm font-medium transition-all duration-500 hover:scale-105 active:scale-95"
        >
          登录
        </button>

        <button
          class="md:hidden p-2.5 rounded-full transition-colors hover:bg-ink-soft/10"
          aria-label="菜单"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'ph-x' : 'ph-list'" class="size-4 text-ink-soft" />
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

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showNotifications"
        class="fixed top-24 right-4 z-50 w-80 max-w-[90vw] rounded-2xl bg-ink border border-ink-soft/10 shadow-xl p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="font-display text-sm font-medium">通知</span>
          <button class="text-xs text-ink-muted hover:text-ink" @click="showNotifications = false">关闭</button>
        </div>
        <div class="text-sm text-ink-muted text-center py-6">
          <img src="/illustrations/happy-news.svg" alt="暂无通知" class="w-32 mx-auto mb-3 opacity-70" />
          暂无新通知
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const user = ref(null)
const unreadCount = ref(0)
const showNotifications = ref(false)
const mobileOpen = ref(false)

const links = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },
  { to: '/people', label: '人物' },
  { to: '/map', label: '足迹' },
  { to: '/search', label: '搜索' },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
