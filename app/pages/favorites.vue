<template>
  <div>
    <section class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <span
          class="inline-block px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted mb-6"
        >
          珍藏
        </span>
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我的收藏
        </h1>
        <p class="mt-5 text-ink-muted text-base max-w-lg mx-auto leading-relaxed">
          珍藏的心动瞬间，都放在这里。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <PhotoSkeleton v-if="initialLoading" :count="12" />
        <EmptyState
          v-else-if="!photos.length"
          image="/illustrations/the-void.svg"
          text="还没有收藏的照片，去首页点亮心形吧"
        />
        <div v-else class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
          <div
            v-for="(photo, idx) in photos"
            :key="photo.id"
            class="photo-card group relative cursor-pointer break-inside-avoid mb-3 sm:mb-4 p-1.5 rounded-[1.375rem] bg-cream-dark/60 dark:bg-ink-soft/10 ring-1 ring-ink-soft/5 shadow-soft transition-all duration-500 ease-soft hover:shadow-soft-lg"
            @click="openPreview(idx)"
          >
            <div class="relative overflow-hidden rounded-[1.125rem]" :style="imgRatio(photo)">
              <NuxtImg
                :src="photo.webpUrl"
                :alt="photo.fileName"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-soft group-hover:scale-105"
                sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                @error="onImgError"
              />
              <div v-if="photo.isVideo" class="absolute inset-0 flex items-center justify-center">
                <span
                  class="flex items-center justify-center size-10 rounded-full bg-ink/55 backdrop-blur-sm text-cream ring-1 ring-cream/25 shadow-soft transition-transform duration-300 ease-soft group-hover:scale-110"
                >
                  <Icon name="heroicons:play" class="size-5 translate-x-0.5" />
                </span>
              </div>
              <button
                class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent text-cream shadow-soft text-sm font-medium transition-all duration-500 ease-soft hover:scale-110 active:scale-95"
                @click.stop="toggleLike(photo)"
              >
                <Icon name="heroicons:heart-solid" class="size-4" />
                <span v-if="photo.likeCount > 1">{{ photo.likeCount }}</span>
              </button>
            </div>
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
useHead({ title: '收藏' })

const photos = ref<any[]>([])
const initialLoading = ref(true)
const previewVisible = ref(false)
const previewIndex = ref(0)
const toast = useToast()
const { onImgError } = useImgFallback()

interface PhotoRatio {
  width?: number | null
  height?: number | null
  aspectRatio?: string | null
  isVideo?: number | boolean | null
}

const imgRatio = (photo: PhotoRatio) =>
  photo.aspectRatio
    ? { aspectRatio: photo.aspectRatio }
    : photo.width && photo.height
      ? { aspectRatio: `${photo.width} / ${photo.height}` }
      : photo.isVideo
        ? { aspectRatio: '16 / 9' }
        : {}

const openPreview = (idx: number) => {
  previewIndex.value = idx
  previewVisible.value = true
}

const toggleLike = async (photo: any) => {
  const target = !photo.liked
  photo.liked = target
  photo.likeCount = target ? (photo.likeCount || 0) + 1 : Math.max(0, (photo.likeCount || 1) - 1)
  try {
    await $fetch(`/api/photos/${photo.id}/like`, {
      method: target ? 'POST' : 'DELETE',
    })
    if (!target) {
      photos.value = photos.value.filter((p) => p.id !== photo.id)
    }
  } catch {
    photo.liked = !target
    photo.likeCount = target ? Math.max(0, (photo.likeCount || 1) - 1) : (photo.likeCount || 0) + 1
    toast.error('操作失败，请重试')
  }
}

onMounted(async () => {
  try {
    const data = await $fetch('/api/photos', { params: { favorites: 1, limit: 100 } })
    photos.value = data?.data ?? []
  } finally {
    initialLoading.value = false
  }
})
</script>
