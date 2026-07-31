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
          <div class="ml-auto hidden lg:flex items-center gap-2 shrink-0">
            <button
              v-if="batchMode"
              class="px-4 py-2 text-xs sm:text-sm rounded-full border border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink/40 transition-all duration-300 whitespace-nowrap"
              @click="toggleSelectAll"
            >
              {{ allSelected ? '取消全选' : '全选' }}
            </button>
            <button
              class="px-4 py-2 text-xs sm:text-sm rounded-full border transition-all duration-300 whitespace-nowrap"
              :class="
                batchMode
                  ? 'bg-accent text-cream border-accent'
                  : 'border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink/40'
              "
              @click="toggleBatchMode"
            >
              {{ batchMode ? `完成 (${selectedIds.length})` : '批量管理' }}
            </button>
          </div>
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
        <div
          v-for="group in photoGroups"
          :key="group.label"
          class="month-group mb-16 sm:mb-20 scroll-mt-32"
          :data-label="group.label"
        >
          <div class="sticky top-[7.5rem] z-30 mb-6 sm:mb-8 py-2">
            <h2 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              {{ group.label }}
            </h2>
          </div>
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
            <div
              v-for="photo in group.photos"
              :key="photo.id"
              class="photo-card group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4 transition-all duration-200"
              :class="
                batchMode && isSelected(photo.id)
                  ? 'ring-2 ring-[#EC5255]/90 shadow-lg shadow-[#EC5255]/25'
                  : ''
              "
              @click="batchMode ? toggleSelect(photo) : openPhoto(photo)"
            >
              <button
                v-if="batchMode"
                class="absolute top-3 left-3 z-10 size-6 rounded-full flex items-center justify-center transition-all duration-200"
                :class="
                  isSelected(photo.id)
                    ? 'bg-[#EC5255] text-cream'
                    : 'bg-ink/60 backdrop-blur-sm text-transparent hover:text-[#EC5255]'
                "
                @click.stop="toggleSelect(photo)"
              >
                <Icon name="heroicons:check" class="size-4" />
              </button>
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

    <MonthNav :months="sideMonths" />

    <div
      v-if="batchMode"
      class="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 items-center gap-4 px-5 py-3 rounded-full bg-ink/85 backdrop-blur-2xl border border-ink-soft/10 shadow-xl"
    >
      <span class="text-cream/80 text-sm whitespace-nowrap">
        已选 <span class="font-medium text-cream">{{ selectedIds.length }}</span> 张
      </span>
      <div class="w-px h-5 bg-cream/15" />
      <button
        class="px-4 py-1.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
        :disabled="!selectedIds.length"
        :class="{ 'opacity-40 pointer-events-none': !selectedIds.length }"
        @click="openMoveDialog"
      >
        移入相册
      </button>
      <button
        class="px-4 py-1.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
        :disabled="!selectedIds.length"
        :class="{ 'opacity-40 pointer-events-none': !selectedIds.length }"
        @click="showDeleteConfirm = true"
      >
        删除
      </button>
      <button
        class="px-3 py-1.5 rounded-full text-sm text-cream/60 hover:text-cream transition-colors"
        @click="exitBatchMode"
      >
        取消
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showMoveDialog"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showMoveDialog = false"
        @keydown.enter.prevent="moveSelected"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-4">移入相册</h3>
          <div v-if="moveAlbumsLoading" class="text-sm text-ink-muted py-4 text-center">
            加载中...
          </div>
          <div v-else class="max-h-64 overflow-y-auto space-y-2">
            <label
              v-for="a in moveAlbums"
              :key="a.id"
              class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
              :class="
                targetAlbumId === a.id
                  ? 'bg-accent/10 ring-1 ring-accent/40'
                  : 'hover:bg-ink-soft/10'
              "
            >
              <input
                v-model="targetAlbumId"
                type="radio"
                :value="a.id"
                class="accent-[#EC5255] size-4 focus:outline-none focus:ring-2 focus:ring-[#EC5255]/40 focus:ring-offset-2 focus:ring-offset-surface rounded-full"
              />
              <span class="flex-1 text-sm truncate">{{ a.title }}</span>
              <span class="text-xs text-ink-muted shrink-0">{{ a.photoCount }} 张</span>
            </label>
            <NuxtLink
              to="/albums/create"
              class="flex items-center justify-center gap-1.5 p-3 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors"
              @click="showMoveDialog = false"
            >
              <Icon name="heroicons:plus" class="size-4" />新建相册
            </NuxtLink>
          </div>
          <button
            class="mt-5 w-full py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-40"
            :disabled="!targetAlbumId || moving"
            @click="moveSelected"
          >
            {{ moving ? '移入中...' : `移入 ${selectedIds.length} 张照片` }}
          </button>
        </div>
      </div>

      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showDeleteConfirm = false"
        @keydown.enter.prevent="deleteSelected"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-2">删除照片</h3>
          <p class="text-sm text-ink-muted mb-6">
            确定要删除选中的
            <span class="text-red-500 font-medium">{{ selectedIds.length }}</span>
            张照片吗？此操作不可恢复。
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-sm text-ink-muted hover:text-ink transition-colors"
              @click="showDeleteConfirm = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-cream text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              :disabled="deleting"
              @click="deleteSelected"
            >
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
const batchMode = ref(false)
const selectedIds = ref<string[]>([])
const showMoveDialog = ref(false)
const showDeleteConfirm = ref(false)
const targetAlbumId = ref('')
const moveAlbums = ref<any[]>([])
const moveAlbumsLoading = ref(false)
const moving = ref(false)
const deleting = ref(false)
const toast = useToast()

const isSelected = (id: string) => selectedIds.value.includes(id)

const toggleSelect = (photo: any) => {
  const idx = selectedIds.value.indexOf(photo.id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(photo.id)
}

const allSelected = computed(
  () => allPhotos.value.length > 0 && selectedIds.value.length === allPhotos.value.length,
)

const toggleSelectAll = () => {
  if (allSelected.value) selectedIds.value = []
  else selectedIds.value = allPhotos.value.map((p) => p.id)
}

const toggleBatchMode = () => {
  if (batchMode.value) exitBatchMode()
  else batchMode.value = true
}

const exitBatchMode = () => {
  batchMode.value = false
  selectedIds.value = []
  showMoveDialog.value = false
  showDeleteConfirm.value = false
}

const openMoveDialog = async () => {
  showMoveDialog.value = true
  targetAlbumId.value = ''
  moveAlbumsLoading.value = true
  try {
    const data = await $fetch('/api/albums')
    moveAlbums.value = data ?? []
  } finally {
    moveAlbumsLoading.value = false
  }
}

const moveSelected = async () => {
  if (!targetAlbumId.value || moving.value) return
  moving.value = true
  try {
    await $fetch('/api/photos/batch-move', {
      method: 'POST',
      body: { ids: selectedIds.value, albumId: targetAlbumId.value },
    })
    toast.success(`已移入相册 ${selectedIds.value.length} 张照片`)
    exitBatchMode()
  } catch {
    toast.error('移入失败，请重试')
  } finally {
    moving.value = false
  }
}

const deleteSelected = async () => {
  if (deleting.value) return
  deleting.value = true
  try {
    const { deleted } = await $fetch('/api/photos/batch-delete', {
      method: 'POST',
      body: { ids: selectedIds.value },
    })
    const removed = new Set(selectedIds.value)
    allPhotos.value = allPhotos.value.filter((p) => !removed.has(p.id))
    toast.success(`已删除 ${deleted ?? selectedIds.value.length} 张照片`)
    exitBatchMode()
  } catch {
    toast.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

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
const { onImgError } = useImgFallback()

const sideMonths = computed(() => photoGroups.value.map((g) => g.label))
const toggleLike = async (photo: any) => {
  const target = !photo.liked
  photo.liked = target
  photo.likeCount = target ? (photo.likeCount || 0) + 1 : Math.max(0, (photo.likeCount || 1) - 1)
  try {
    await $fetch(`/api/photos/${photo.id}/like`, {
      method: target ? 'POST' : 'DELETE',
    })
  } catch {
    photo.liked = !target
    photo.likeCount = target ? Math.max(0, (photo.likeCount || 1) - 1) : (photo.likeCount || 0) + 1
    toast.error('操作失败，请重试')
  }
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
  const data = await $fetch('/api/photos', {
    params: {
      cursor: page.value,
      limit: 30,
      year: selectedMonth.value !== 'all' ? selectedMonth.value : undefined,
    },
  })
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
          toggleActions: 'play none none none',
          once: true,
        },
      },
    )
  })
}

watch(selectedMonth, () => {
  fetchPhotos(true)
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  window.addEventListener('scroll', onScroll, { passive: true })
})

const onScroll = () => {
  if (loadTrigger.value && hasMore.value && !loadingMore.value) {
    const rect = loadTrigger.value.getBoundingClientRect()
    if (rect.top < window.innerHeight + 300) fetchPhotos()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
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
