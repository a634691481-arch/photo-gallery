<template>
  <main class="overflow-x-hidden w-full max-w-full">
    <section id="content" class="pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-12 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 5rem)"
        >
          值得 珍藏的 瞬间
        </h1>
        <p
          class="mt-4 sm:mt-6 text-ink-muted text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
        >
          一个属于我们家庭的私密相册，记录成长，留住时光。
        </p>
      </div>
    </section>

    <section class="sticky top-[4.5rem] z-40 px-6 pb-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          <button
            v-for="m in months"
            :key="m.value"
            class="shrink-0 px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-300 whitespace-nowrap"
            :class="
              selectedMonth === m.value
                ? 'bg-ink text-cream'
                : 'bg-ink-soft/10 text-ink-muted hover:text-ink hover:bg-ink-soft/20'
            "
            @click="selectedMonth = m.value"
          >
            {{ m.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <PhotoSkeleton v-if="initialLoading" :count="12" />
        <EmptyState
          v-else-if="!loadingMore && photoGroups.length === 0"
          text="这个时间段还没有照片"
        />
        <div v-for="group in photoGroups" :key="group.label" class="mb-16 sm:mb-20">
          <div class="sticky top-[7.5rem] z-30 mb-6 sm:mb-8 py-2">
            <h2 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              {{ group.label }}
            </h2>
          </div>
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
            <div
              v-for="photo in group.photos"
              :key="photo.id"
              class="photo-card group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4"
              @click="openPhoto(photo)"
            >
              <img
                :src="photo.webpUrl"
                :alt="photo.fileName"
                loading="lazy"
                class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 group-active:scale-105"
                @error="onImgError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
              >
                <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div class="flex items-center gap-2">
                    <span v-if="photo.isVideo" class="text-cream/80 text-xs flex items-center gap-1"
                      ><Icon name="ph-play-circle-fill" class="size-3"
                    /></span>
                    <span class="text-cream/60 text-xs">{{ formatDate(photo.takenAt) }}</span>
                  </div>
                </div>
              </div>
              <button
                class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 active:scale-95"
                :class="
                  photo.liked
                    ? 'bg-red-500/90 text-cream shadow-lg shadow-red-500/30'
                    : 'bg-ink/70 text-cream/70 backdrop-blur-sm hover:bg-ink/90 hover:text-cream'
                "
                @click.stop="toggleLike(photo)"
              >
                <Icon :name="photo.liked ? 'ph-heart-fill' : 'ph-heart'" class="size-4" />
                <span v-if="photo.likeCount > 0">{{ photo.likeCount }}</span>
              </button>
            </div>
          </div>
        </div>
        <div ref="loadTrigger" class="flex justify-center py-12">
          <div v-if="loadingMore" class="flex items-center gap-2 text-ink-muted">
            <Icon name="heroicons:arrow-path" class="size-5 animate-spin" />加载中...
          </div>
          <p v-else-if="!hasMore && photoGroups.length > 0" class="text-ink-muted text-sm">
            已经到底了
          </p>
        </div>
      </div>
    </section>

    <PhotoPreview
      :photos="allPhotos"
      :visible="previewVisible"
      :model-value="previewIndex"
      @update:model-value="previewIndex = $event"
      @close="previewVisible = false"
    />
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { $gsap, $ScrollTrigger } = useNuxtApp()

const selectedMonth = ref('all')
const previewVisible = ref(false)
const previewIndex = ref(0)
const allPhotos = ref<any[]>([])
const loadingMore = ref(false)
const initialLoading = ref(true)
const page = ref(0)
const hasMore = ref(true)
const loadTrigger = ref<HTMLElement>()

const months = [
  { label: '全部', value: 'all' },
  { label: '2026年', value: '2026' },
  { label: '2025年', value: '2025' },
  { label: '2024年', value: '2024' },
]

const photoGroups = computed(() => {
  const filtered =
    selectedMonth.value === 'all'
      ? allPhotos.value
      : allPhotos.value.filter((p: any) => p.takenAt?.startsWith(selectedMonth.value))
  const groups: Record<string, any[]> = {}
  for (const p of filtered) {
    const d = new Date(p.takenAt)
    const key = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  }
  return Object.entries(groups).map(([label, photos]) => ({ label, photos }))
})

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : ''
const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.background = '#25201b'
  img.style.minHeight = '200px'
  img.src = ''
}
const toggleLike = (photo: any) => {
  photo.liked = !photo.liked
  photo.likeCount = photo.liked
    ? (photo.likeCount || 0) + 1
    : Math.max(0, (photo.likeCount || 1) - 1)
}
const openPhoto = (photo: any) => {
  previewIndex.value = allPhotos.value.findIndex((p: any) => p.id === photo.id)
  previewVisible.value = true
}

async function fetchPhotos(reset = false) {
  if (reset) {
    page.value = 0
    hasMore.value = true
    allPhotos.value = []
  }
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  const data = await $fetch('/api/photos', { params: { cursor: page.value, limit: 30 } })
  if (data?.data?.length) {
    allPhotos.value.push(...data.data)
    page.value += data.data.length
    if (!data.nextCursor) hasMore.value = false
  } else {
    hasMore.value = false
  }
  loadingMore.value = false
  initialLoading.value = false
  await nextTick()
  refreshGSAP()
}

function refreshGSAP() {
  if (!$gsap || !$ScrollTrigger) return
  $ScrollTrigger.refresh()
  $gsap.utils.toArray<HTMLElement>('.photo-card').forEach((el) => {
    if (el.dataset.gsapInited) return
    el.dataset.gsapInited = '1'
    $gsap.fromTo(
      el,
      { opacity: 0, scale: 0.92, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=60px',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })
}

watch(selectedMonth, () => {
  fetchPhotos(true)
})

onMounted(async () => {
  await fetchPhotos()
  if (loadTrigger.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchPhotos()
      },
      { rootMargin: '200px' },
    )
    observer.observe(loadTrigger.value)
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
