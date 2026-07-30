<template>
  <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="break-inside-avoid mb-3 sm:mb-4"
    >
      <div
        class="rounded-2xl bg-cream-dark/40 dark:bg-ink-soft/10 animate-pulse"
        :style="{ paddingBottom: `${randomHeight(i)}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 12 })

const heights = [60, 80, 70, 90, 75, 55, 85, 65, 95, 78, 68, 82]
const randomHeight = (i: number) => heights[i % heights.length]
</script>
