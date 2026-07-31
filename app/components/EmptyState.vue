<template>
  <div
    v-if="variant === 'card'"
    class="rounded-2xl overflow-hidden bg-cream-dark/20 dark:bg-ink-soft/10 aspect-[2/1] sm:aspect-[3/1] flex items-center justify-center"
  >
    <div class="text-center">
      <img
        src="/illustrations/undraw_exploring_d1vd.svg"
        class="w-44 sm:w-52 mx-auto mb-3 opacity-80"
      />
      <p class="text-ink-muted text-sm mt-3">{{ text }}</p>
      <slot />
    </div>
  </div>
  <div v-else class="text-center py-16">
    <img
      src="/illustrations/undraw_exploring_d1vd.svg"
      class="w-44 sm:w-52 mx-auto mb-4 opacity-80"
    />
    <p class="text-ink-muted text-sm">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    variant?: 'card' | 'default'
  }>(),
  { text: '', variant: 'default' },
)

//   undraw_ask-online_8zdn.svg

//undraw_ask-online_8zdn
</script>
