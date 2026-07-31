<template>
  <Teleport to="body">
    <div class="fixed top-20 right-5 z-[10000] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'pointer-events-auto px-5 py-3 rounded-2xl text-sm font-medium shadow-lg backdrop-blur-xl flex items-center gap-2 max-w-sm border',
            t.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
              : t.type === 'error'
                ? 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30'
                : 'bg-ink/80 text-cream border-ink-soft/20',
          ]"
        >
          <Icon :name="iconName(t.type)" class="size-4 shrink-0" />
          <span class="flex-1">{{ t.message }}</span>
          <button
            class="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            aria-label="关闭"
            @click="dismiss(t.id)"
          >
            <Icon name="heroicons:x-mark" class="size-3.5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

function iconName(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'heroicons:check-circle'
    case 'error':
      return 'heroicons:x-circle'
    case 'info':
      return 'heroicons:information-circle'
  }
}
</script>

<style>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.92);
}
</style>
