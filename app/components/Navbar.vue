<template>
  <nav class="fixed top-4 sm:top-6 inset-x-0 z-[var(--z-nav)] px-4 pointer-events-none">
    <div
      class="mx-auto w-full max-w-5xl pointer-events-auto p-1 rounded-full ring-1 ring-ink-soft/10 shadow-soft bg-surface/60 dark:bg-surface/40 backdrop-blur-xl"
    >
      <div class="flex items-center justify-between rounded-full bg-cream/40 dark:bg-cream/30">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-300 hover:bg-ink-soft/10"
        >
          <span
            class="size-2 rounded-full bg-accent shadow-soft transition-transform duration-500 ease-soft group-hover:scale-125"
          />
          <span class="font-display text-sm sm:text-base font-semibold tracking-tight text-ink">
            家庭相册
          </span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 text-sm rounded-full transition-all duration-300 ease-soft text-ink-muted hover:text-ink hover:bg-ink-soft/10 whitespace-nowrap"
            active-class="!text-ink !bg-ink-soft/20"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-1.5">
          <NuxtLink
            to="/upload"
            class="hidden md:inline-flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            上传照片
            <span
              class="size-7 rounded-full bg-cream/15 flex items-center justify-center transition-transform duration-500 ease-soft group-hover:translate-x-0.5"
            >
              <Icon name="heroicons:arrow-up-tray" class="size-3.5" />
            </span>
          </NuxtLink>

          <button
            class="md:hidden p-2.5 rounded-full transition-colors duration-300 hover:bg-ink-soft/10"
            aria-label="打开菜单"
            :aria-expanded="open"
            @click="open = !open"
          >
            <span class="relative block size-4">
              <span
                class="absolute left-0 top-0.5 block h-px w-full bg-ink transition-all duration-500 ease-soft"
                :class="open ? 'top-1/2 rotate-45' : ''"
              />
              <span
                class="absolute left-0 top-1/2 block h-px w-full bg-ink transition-all duration-500 ease-soft"
                :class="open ? 'opacity-0 translate-x-2' : ''"
              />
              <span
                class="absolute left-0 bottom-0.5 block h-px w-full bg-ink transition-all duration-500 ease-soft"
                :class="open ? 'bottom-[calc(50%-1px)] -rotate-45' : ''"
              />
            </span>
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-500 ease-soft"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-soft"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 -z-10 md:hidden bg-surface/85 backdrop-blur-3xl flex flex-col items-center justify-center gap-2 overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
        @click="open = false"
      >
        <NuxtLink
          v-for="(link, i) in mobileLinks"
          :key="link.to"
          :to="link.to"
          class="font-display text-3xl font-semibold tracking-tight text-ink py-3 transition-all duration-700 ease-soft hover:text-accent"
          active-class="!text-accent"
          :style="{ transitionDelay: `${150 + i * 90}ms` }"
          @click="open = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const open = ref(false)

const links = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },
  { to: '/favorites', label: '收藏' },
]

const mobileLinks = [
  { to: '/', label: '时间线' },
  { to: '/albums', label: '相册' },
  { to: '/favorites', label: '收藏' },
  { to: '/upload', label: '上传照片' },
]

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && open.value) open.value = false
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>
