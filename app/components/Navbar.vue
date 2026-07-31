<template>
  <nav
    class="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-full border border-ink-soft/20 bg-ink/60 backdrop-blur-xl shadow-sm"
  >
    <div class="flex items-center gap-0.5 sm:gap-1 flex-nowrap">
      <NuxtLink
        to="/"
        active-class=""
        class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors hover:bg-ink-soft/10 whitespace-nowrap"
        @click="mobileOpen = false"
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
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ink text-cream text-xs sm:text-sm font-medium transition-all duration-500 hover:scale-105 active:scale-95 whitespace-nowrap"
          @click="mobileOpen = false"
        >
          上传照片
        </NuxtLink>

        <button
          class="md:hidden p-2 sm:p-2.5 rounded-full transition-colors hover:bg-ink-soft/10"
          aria-label="菜单"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon
            :name="mobileOpen ? 'heroicons:x-mark' : 'heroicons:bars-3-bottom-right'"
            class="size-4 text-ink-soft"
          />
        </button>
      </div>
    </div>
  </nav>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl"
        @click="mobileOpen = false"
      >
        <div class="pt-28 px-6 flex flex-col gap-2" @click.stop>
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-5 py-4 text-base rounded-2xl text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

const links = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },

  { to: '/search', label: '搜索' },
]
</script>
