<template>
  <div>
    <section class="pt-24 sm:pt-32 pb-8 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button
            class="p-2 rounded-full hover:bg-cream-dark/30 dark:hover:bg-ink-soft/10 transition-colors"
            @click="navigateTo('/people')"
          >
            <Icon name="heroicons:arrow-left" class="size-5" />
          </button>
          <div>
            <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ person.name }}</h1>
            <p class="text-ink-muted text-sm mt-1">{{ photos.length }} 张照片</p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <div class="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
          <div
            v-for="(photo, idx) in photos"
            :key="photo.id"
            class="group relative overflow-hidden rounded-2xl bg-cream-dark/20 dark:bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4"
            @click="openPreview(idx)"
          >
            <img
              :src="photo.webpUrl"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <PhotoPreview
      :photos="photos"
      :visible="previewVisible"
      :model-value="previewIndex"
      @update:model-value="previewIndex = $event"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const person = ref({ name: '宝宝 Emma' })
const previewVisible = ref(false)
const previewIndex = ref(0)

const openPreview = (idx: number) => {
  previewIndex.value = idx
  previewVisible.value = true
}

const photos = Array.from({ length: 20 }, (_, i) => ({
  id: `p${i}`,
  webpUrl: `https://picsum.photos/seed/face${route.params.id}${i}/${400 + (i % 4) * 150}/${300 + (i % 5) * 150}`,
}))
</script>
