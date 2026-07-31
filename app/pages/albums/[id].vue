<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button
            class="p-2 rounded-full hover:bg-ink-soft/10 transition-colors"
            @click="navigateTo('/albums')"
          >
            <Icon name="heroicons:arrow-left" class="size-5" />
          </button>
          <div>
            <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ album?.title }}</h1>
            <p class="text-ink-muted text-sm mt-1">{{ album?.photoCount ?? 0 }} 张照片</p>
          </div>
        </div>
      </div>
    </section>
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <EmptyState v-else-if="!album?.photos?.length" text="这个相册还没有照片">
          <NuxtLink
            to="/upload"
            class="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Icon name="heroicons:cloud-arrow-up" class="size-4" />去上传
          </NuxtLink>
        </EmptyState>
        <div v-else class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
          <div
            v-for="(photo, idx) in album?.photos ?? []"
            :key="photo.id"
            class="photo-card group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4"
            @click="openPreview(idx)"
          >
            <img
              :src="photo.webpUrl"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              @error="onImgError"
            />
          </div>
        </div>
        <PhotoPreview
          :photos="album?.photos ?? []"
          :visible="previewVisible"
          :model-value="previewIndex"
          @update:model-value="previewIndex = $event"
          @close="previewVisible = false"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const { data, pending } = useFetch(`/api/albums/${route.params.id}`)
const album = computed(() => data.value as any)
const previewVisible = ref(false)
const previewIndex = ref(0)
const openPreview = (idx: number) => {
  previewIndex.value = idx
  previewVisible.value = true
}
const { onImgError } = useImgFallback()
</script>
