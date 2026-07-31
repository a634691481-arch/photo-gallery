<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我的收藏
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">珍藏的心动瞬间，都放在这里。</p>
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
            class="photo-card group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4"
            @click="openPreview(idx)"
          >
            <img
              :src="photo.webpUrl"
              :alt="photo.fileName"
              loading="lazy"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              @error="onImgError"
            />
            <button
              class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-500/90 text-cream shadow-lg shadow-red-500/30 text-sm font-medium transition-all duration-300 hover:scale-110 active:scale-95"
              @click.stop="toggleLike(photo)"
            >
              <Icon name="ph-heart-fill" class="size-4" />
              <span v-if="photo.likeCount > 0">{{ photo.likeCount }}</span>
            </button>
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

const photos = ref<any[]>([])
const initialLoading = ref(true)
const previewVisible = ref(false)
const previewIndex = ref(0)
const toast = useToast()
const { onImgError } = useImgFallback()

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
