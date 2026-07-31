<template>
  <main class="overflow-x-hidden w-full max-w-full">
    <!-- Hero -->
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

    <!-- Month filter pills -->
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

    <!-- Timeline masonry -->
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
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
                      ><Icon name="heroicons:play-circle-solid" class="size-3"
                    /></span>
                    <span class="text-cream/60 text-xs">{{ formatDate(photo.takenAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref="loadTrigger" class="flex justify-center py-12">
          <div v-if="loading" class="flex items-center gap-2 text-ink-muted">
            <Icon name="heroicons:arrow-path" class="size-5 animate-spin" />加载中...
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
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
const loading = ref(false)
const loadTrigger = ref<HTMLElement>()
const previewVisible = ref(false)
const previewIndex = ref(0)

const months = [
  { label: '全部', value: 'all' },
  { label: '2026年', value: '2026' },
  { label: '2025年', value: '2025' },
  { label: '2024年', value: '2024' },
  { label: '2023年', value: '2023' },
  { label: '更早', value: 'earlier' },
]

const photoGroups = ref([
  {
    label: '2026 年 7 月',
    photos: Array.from({ length: 15 }, (_, i) => ({
      id: `photo-${i}`,
      webpUrl: `https://picsum.photos/seed/jul${i}/${400 + (i % 3) * 200}/${300 + (i % 4) * 200}`,
      fileName: `DSC_${1000 + i}.jpg`,
      takenAt: `2026-07-${String(10 + i).padStart(2, '0')}`,
      isVideo: i === 4,
    })),
  },
  {
    label: '2026 年 6 月',
    photos: Array.from({ length: 10 }, (_, i) => ({
      id: `photo-jun-${i}`,
      webpUrl: `https://picsum.photos/seed/jun${i}/${400 + (i % 3) * 200}/${300 + (i % 4) * 200}`,
      fileName: `IMG_${2000 + i}.jpg`,
      takenAt: `2026-06-${String(15 + i).padStart(2, '0')}`,
      isVideo: false,
    })),
  },
])

const allPhotos = computed(() => photoGroups.value.flatMap((g) => g.photos))

const formatDate = (d: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.background = '#25201b'
  img.style.minHeight = '200px'
  img.src = ''
}

const openPhoto = (photo: any) => {
  previewIndex.value = allPhotos.value.findIndex((p) => p.id === photo.id)
  previewVisible.value = true
}

onMounted(() => {
  if (!$gsap || !$ScrollTrigger) return
  const ctx = $gsap.context(() => {
    $gsap.utils.toArray('.photo-card').forEach((el: any) => {
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
  })
  onUnmounted(() => ctx.revert())
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
