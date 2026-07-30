<template>
  <div
    v-if="variant === 'card'"
    class="rounded-2xl overflow-hidden bg-cream-dark/20 dark:bg-ink-soft/10 aspect-[2/1] sm:aspect-[3/1] flex items-center justify-center"
  >
    <div class="text-center">
      <img :src="image" :alt="alt" class="w-44 sm:w-52 mx-auto mb-3 opacity-80" />
      <p class="text-ink-muted text-sm">{{ text }}</p>
      <slot />
    </div>
  </div>
  <div v-else class="text-center py-16">
    <img :src="image" :alt="alt" class="w-44 sm:w-52 mx-auto mb-4 opacity-80" />
    <p class="text-ink-muted text-sm">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string
    alt: string
    text: string
    variant?: 'card' | 'default'
  }>(),
  { variant: 'default' },
)
</script>
