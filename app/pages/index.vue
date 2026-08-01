<template>
  <main class="overflow-x-hidden w-full max-w-full">
    <section id="content" class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <span
          class="hero-reveal inline-block px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted mb-6"
        >
          私密家庭相册
        </span>
        <h1
          class="hero-reveal font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.75rem, 6vw, 5.5rem)"
        >
          值得 珍藏的 瞬间
        </h1>
        <p
          class="hero-reveal mt-6 sm:mt-8 text-ink-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed"
        >
          一个属于我们家庭的私密相册，记录成长，留住时光。
        </p>
      </div>
    </section>

    <section class="sticky top-[4.5rem] z-[var(--z-float)] px-6 pb-4">
      <div class="max-w-7xl mx-auto">
        <div
          class="p-1 rounded-full bg-surface/70 backdrop-blur-xl shadow-soft ring-1 ring-ink-soft/10"
        >
          <div class="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
            <button
              v-for="m in months"
              :key="m.value"
              class="shrink-0 px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-500 ease-soft whitespace-nowrap"
              :class="
                selectedMonth === m.value
                  ? 'bg-ink text-cream shadow-soft'
                  : 'text-ink-muted hover:text-ink hover:bg-ink-soft/10'
              "
              @click="selectMonth(m.value)"
            >
              {{ m.label }}
            </button>
            <div class="ml-auto hidden lg:flex items-center gap-1 shrink-0">
              <button
                v-if="batchMode"
                class="px-4 py-2 text-xs sm:text-sm rounded-full text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-all duration-500 ease-soft whitespace-nowrap"
                @click="toggleSelectAll"
              >
                {{ allSelected ? '取消全选' : '全选' }}
              </button>
              <button
                class="px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-500 ease-soft whitespace-nowrap"
                :class="
                  batchMode
                    ? 'bg-accent text-cream shadow-soft'
                    : hasPhotos
                      ? 'text-ink-muted hover:text-ink hover:bg-ink-soft/10'
                      : 'opacity-40 cursor-not-allowed'
                "
                :disabled="!hasPhotos"
                @click="toggleBatchMode"
              >
                {{ batchMode ? `完成 (${selectedIds.length})` : '批量管理' }}
              </button>
            </div>
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
          <div class="sticky top-[7.5rem] z-[var(--z-sticky)] mb-6 sm:mb-8 py-2">
            <h2 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              {{ group.label }}
            </h2>
          </div>
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
            <div
              v-for="photo in group.photos"
              :key="photo.id"
              class="photo-card group relative cursor-pointer break-inside-avoid mb-3 sm:mb-4 p-1.5 rounded-[1.375rem] bg-cream-dark/60 dark:bg-ink-soft/10 ring-1 ring-ink-soft/5 shadow-soft transition-all duration-500 ease-soft hover:shadow-soft-lg"
              :class="batchMode && isSelected(photo.id) ? '!ring-2 !ring-accent/80' : ''"
              @click="batchMode ? toggleSelect(photo) : openPhoto(photo)"
            >
              <div class="relative overflow-hidden rounded-[1.125rem]" :style="imgRatio(photo)">
                <button
                  v-if="batchMode"
                  class="absolute top-3 left-3 z-10 size-6 rounded-full flex items-center justify-center transition-all duration-300 ease-soft"
                  :class="
                    isSelected(photo.id)
                      ? 'bg-accent text-cream'
                      : 'bg-ink/60 backdrop-blur-sm text-transparent hover:text-accent'
                  "
                  @click.stop="toggleSelect(photo)"
                >
                  <Icon name="heroicons:check" class="size-4" />
                </button>
                <NuxtImg
                  :src="photo.webpUrl"
                  :alt="photo.fileName"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-soft group-hover:scale-105 group-active:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  @error="onImgError"
                />
                <div v-if="photo.isVideo" class="absolute inset-0 flex items-center justify-center">
                  <span
                    class="flex items-center justify-center size-10 rounded-full bg-ink/55 backdrop-blur-sm text-cream ring-1 ring-cream/25 shadow-soft transition-transform duration-300 ease-soft group-hover:scale-110"
                  >
                    <Icon name="heroicons:play" class="size-5 translate-x-0.5" />
                  </span>
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 ease-soft"
                >
                  <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <div class="flex items-center gap-2">
                      <span class="text-cream/60 text-xs">{{ formatDate(photo.takenAt) }}</span>
                    </div>
                  </div>
                </div>
                <button
                  class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ease-soft hover:scale-110 active:scale-95"
                  :class="[
                    photo.liked
                      ? 'bg-accent text-cream shadow-soft opacity-100'
                      : 'bg-ink/70 text-cream/70 backdrop-blur-sm hover:bg-ink/90 hover:text-cream opacity-0 md:group-hover:opacity-100 group-active:opacity-100',
                  ]"
                  @click.stop="toggleLike(photo)"
                >
                  <Icon
                    :name="photo.liked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                    class="size-4"
                  />
                  <span v-if="photo.likeCount > 1">{{ photo.likeCount }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div ref="loadTrigger" class="flex justify-center py-12" aria-live="polite">
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
      class="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-nav)] items-center gap-4 px-5 py-3 rounded-full bg-ink/85 backdrop-blur-2xl ring-1 ring-cream/10 shadow-soft-lg"
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
        class="fixed inset-0 z-[var(--z-dialog)] bg-cream/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
        @click.self="showMoveDialog = false"
        @keydown.enter.prevent="moveSelected"
      >
        <div
          class="w-full max-w-sm p-1.5 rounded-[1.75rem] bg-ink-soft/10 ring-1 ring-ink-soft/10 shadow-soft-lg"
        >
          <div class="bg-ink/85 backdrop-blur-xl rounded-[1.375rem] p-6 text-cream">
            <h3 class="font-display font-medium mb-4">移入相册</h3>
            <div v-if="moveAlbumsLoading" class="text-sm text-cream/70 py-4 text-center">
              加载中...
            </div>
            <div v-else class="max-h-64 overflow-y-auto space-y-2">
              <label
                v-for="a in moveAlbums"
                :key="a.id"
                class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-300 ease-soft"
                :class="
                  targetAlbumId === a.id
                    ? 'bg-accent/15 ring-1 ring-accent/40'
                    : 'hover:bg-cream/10'
                "
              >
                <input
                  v-model="targetAlbumId"
                  type="radio"
                  :value="a.id"
                  class="accent-accent size-4 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-surface rounded-full"
                />
                <span class="flex-1 text-sm truncate">{{ a.title }}</span>
                <span class="text-xs text-cream/60 shrink-0">{{ a.photoCount }} 张</span>
              </label>
              <button
                class="flex items-center justify-center gap-1.5 p-3 rounded-xl text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors duration-300 w-full"
                @click="showCreateDialog = true"
              >
                <Icon name="heroicons:plus" class="size-4" />新建相册
              </button>
            </div>
            <button
              class="mt-5 w-full py-2.5 rounded-full bg-cream text-ink text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] disabled:opacity-40"
              :disabled="!targetAlbumId || moving"
              @click="moveSelected"
            >
              {{ moving ? '移入中...' : `移入 ${selectedIds.length} 张照片` }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-[var(--z-dialog)] bg-cream/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
        @click.self="showDeleteConfirm = false"
        @keydown.enter.prevent="deleteSelected"
      >
        <div
          class="w-full max-w-sm p-1.5 rounded-[1.75rem] bg-ink-soft/10 ring-1 ring-ink-soft/10 shadow-soft-lg"
        >
          <div class="bg-surface dark:bg-surface rounded-[1.375rem] p-6 text-ink dark:text-cream">
            <h3 class="font-display font-medium mb-2">删除照片</h3>
            <p class="text-sm text-ink-muted mb-6">
              确定要删除选中的
              <span class="text-red-500 font-medium">{{ selectedIds.length }}</span>
              张照片吗？此操作不可恢复。
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 px-4 py-2.5 rounded-full text-sm text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors duration-300"
                @click="showDeleteConfirm = false"
              >
                取消
              </button>
              <button
                class="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-cream text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] disabled:opacity-50"
                :disabled="deleting"
                @click="deleteSelected"
              >
                {{ deleting ? '删除中...' : '确认删除' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <AlbumCreateDialog v-model:visible="showCreateDialog" @created="onAlbumCreated" />

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
useHead({ title: '时间线' })
const { $gsap, $ScrollTrigger } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const selectedMonth = ref(typeof route.query.month === 'string' ? route.query.month : 'all')
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
const hasPhotos = computed(() => allPhotos.value.length > 0)
const showMoveDialog = ref(false)
const showCreateDialog = ref(false)
const showDeleteConfirm = ref(false)
const targetAlbumId = ref('')
const moveAlbums = ref<any[]>([])
const moveAlbumsLoading = ref(false)
const moving = ref(false)
const deleting = ref(false)
const toast = useToast()
const { onImgError } = useImgFallback()

useBodyLock(showMoveDialog)
useBodyLock(showDeleteConfirm)
useBodyLock(showCreateDialog)

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

const selectMonth = (m: string) => {
  selectedMonth.value = m
  router.replace({ query: m === 'all' ? {} : { month: m } })
}

watch(
  () => route.query.month,
  (v) => {
    const m = typeof v === 'string' ? v : 'all'
    if (m !== selectedMonth.value) selectedMonth.value = m
  },
)

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

const onAlbumCreated = async (id: string) => {
  targetAlbumId.value = id
  try {
    const data = await $fetch('/api/albums')
    moveAlbums.value = data ?? []
  } catch {
    /* 列表刷新失败可忽略 */
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

const { data: years } = await useFetch('/api/photos/years')

const months = computed(() => [
  { label: '全部', value: 'all' },
  ...(years.value ?? []).map((y: number) => ({ label: `${y}年`, value: String(y) })),
])

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

let observer: IntersectionObserver | undefined

onMounted(async () => {
  if ($gsap) {
    $gsap.fromTo(
      '.hero-reveal',
      { opacity: 0, y: 40, blur: 6 },
      {
        opacity: 1,
        y: 0,
        blur: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      },
    )
  }
  await fetchPhotos()
  if (loadTrigger.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchPhotos()
      },
      { rootMargin: '200px' },
    )
    observer.observe(loadTrigger.value)
  }
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
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
