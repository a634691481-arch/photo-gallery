<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button
            class="p-2 rounded-full hover:bg-ink-soft/10 transition-colors"
            @click="navigateTo('/albums')"
          >
            <Icon name="heroicons:arrow-left" class="size-5" />
          </button>
          <div class="flex-1">
            <h1 class="font-display text-2xl sm:text-3xl font-semibold">{{ album?.title }}</h1>
            <p class="text-ink-muted text-sm mt-1">{{ album?.photoCount ?? 0 }} 张照片</p>
          </div>
          <button
            class="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap"
            :class="
              batchMode
                ? 'bg-accent text-cream border-accent'
                : 'border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink/40'
            "
            @click="toggleBatchMode"
          >
            <Icon name="heroicons:check-circle" class="size-4" />
            {{ batchMode ? `完成 (${selectedIds.length})` : '批量管理' }}
          </button>
          <button
            class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-red-500 border border-red-300/60 dark:border-red-800/60 hover:bg-red-500/10 transition-colors"
            @click="confirmDelete = true"
          >
            <Icon name="heroicons:trash" class="size-4" />删除相册
          </button>
        </div>
      </div>
    </section>
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <EmptyState v-else-if="!album?.photos?.length" text="这个相册还没有照片">
          <NuxtLink
            :to="`/upload?album=${route.params.id}`"
            class="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Icon name="heroicons:cloud-arrow-up" class="size-4" />去上传
          </NuxtLink>
        </EmptyState>
        <div v-else class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4">
          <div
            v-for="(photo, idx) in album?.photos ?? []"
            :key="photo.id"
            class="photo-card group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4 transition-all duration-200"
            :class="
              batchMode && isSelected(photo.id)
                ? 'ring-2 ring-[#EC5255]/90 shadow-lg shadow-[#EC5255]/25'
                : ''
            "
            @click="batchMode ? toggleSelect(photo) : openPreview(idx)"
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
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              @error="onImgError"
            />
            <div
              v-if="isCover(photo)"
              class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-accent text-cream text-xs font-medium flex items-center gap-1"
            >
              <Icon name="heroicons:photo" class="size-3" />封面
            </div>
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
        @click="setCoverSelected"
      >
        设为封面
      </button>
      <button
        class="px-4 py-1.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
        :disabled="!selectedIds.length"
        :class="{ 'opacity-40 pointer-events-none': !selectedIds.length }"
        @click="showRemoveConfirm = true"
      >
        移除相册
      </button>
      <button
        class="px-4 py-1.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
        :disabled="!selectedIds.length"
        :class="{ 'opacity-40 pointer-events-none': !selectedIds.length }"
        @click="openMoveDialog"
      >
        更换相册
      </button>
      <button
        class="px-4 py-1.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-105"
        :disabled="!selectedIds.length"
        :class="{ 'opacity-40 pointer-events-none': !selectedIds.length }"
        @click="showBatchDeleteConfirm = true"
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
        v-if="showRemoveConfirm"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showRemoveConfirm = false"
        @keydown.enter.prevent="removeSelected"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-2">移除照片</h3>
          <p class="text-sm text-ink-muted mb-6">
            确定将选中的
            <span class="text-red-500 font-medium">{{ selectedIds.length }}</span> 张照片从「{{
              album?.title
            }}」移除吗？照片仍保留在时间线中。
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-sm text-ink-muted hover:text-ink transition-colors"
              @click="showRemoveConfirm = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-accent text-cream text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              :disabled="removing"
              @click="removeSelected"
            >
              {{ removing ? '移除中...' : '确认移除' }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showMoveDialog"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showMoveDialog = false"
        @keydown.enter.prevent="moveSelected"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-4">更换相册</h3>
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
                  ? 'bg-[#EC5255]/10 ring-1 ring-[#EC5255]/40'
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
          </div>
          <button
            class="mt-5 w-full py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-40"
            :disabled="!targetAlbumId || moving"
            @click="moveSelected"
          >
            {{ moving ? '更换中...' : `更换到所选相册` }}
          </button>
        </div>
      </div>

      <div
        v-if="showBatchDeleteConfirm"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showBatchDeleteConfirm = false"
        @keydown.enter.prevent="batchDeleteSelected"
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
              @click="showBatchDeleteConfirm = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-[#EC5255] text-cream text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              :disabled="batchDeleting"
              @click="batchDeleteSelected"
            >
              {{ batchDeleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="confirmDelete"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="confirmDelete = false"
        @keydown.enter.prevent="deleteAlbum"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-2">删除相册</h3>
          <p class="text-sm text-ink-muted mb-6">
            确定要删除「{{ album?.title }}」吗？相册中的照片不会被删除，仅移除相册分组。
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-sm text-ink-muted hover:text-ink transition-colors"
              :disabled="deleting"
              @click="confirmDelete = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-cream text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              :disabled="deleting"
              @click="deleteAlbum"
            >
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const { data, pending } = useFetch(`/api/albums/${route.params.id}`)
const album = computed(() => data.value as any)
const previewVisible = ref(false)
const previewIndex = ref(0)
const confirmDelete = ref(false)
const deleting = ref(false)
const coverUpdating = ref('')
const toast = useToast()
const batchMode = ref(false)
const selectedIds = ref<string[]>([])
const showRemoveConfirm = ref(false)
const showMoveDialog = ref(false)
const showBatchDeleteConfirm = ref(false)
const targetAlbumId = ref('')
const moveAlbums = ref<any[]>([])
const moveAlbumsLoading = ref(false)
const removing = ref(false)
const moving = ref(false)
const batchDeleting = ref(false)
const openPreview = (idx: number) => {
  previewIndex.value = idx
  previewVisible.value = true
}
const { onImgError } = useImgFallback()

const isSelected = (id: string) => selectedIds.value.includes(id)

const toggleSelect = (photo: any) => {
  const idx = selectedIds.value.indexOf(photo.id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(photo.id)
}

const toggleBatchMode = () => {
  if (batchMode.value) exitBatchMode()
  else batchMode.value = true
}

const exitBatchMode = () => {
  batchMode.value = false
  selectedIds.value = []
  showRemoveConfirm.value = false
  showMoveDialog.value = false
  showBatchDeleteConfirm.value = false
}

const removeFromList = (ids: string[]) => {
  const removed = new Set(ids)
  if (album.value) {
    album.value.photos = (album.value.photos ?? []).filter((p: any) => !removed.has(p.id))
    album.value.photoCount = album.value.photos.length
  }
}

const removeSelected = async () => {
  if (removing.value) return
  removing.value = true
  try {
    await $fetch(`/api/albums/${route.params.id}/remove`, {
      method: 'POST',
      body: { ids: selectedIds.value },
    })
    toast.success(`已移除 ${selectedIds.value.length} 张照片`)
    removeFromList(selectedIds.value)
    exitBatchMode()
  } catch {
    toast.error('移除失败，请重试')
  } finally {
    removing.value = false
  }
}

const openMoveDialog = async () => {
  showMoveDialog.value = true
  targetAlbumId.value = ''
  moveAlbumsLoading.value = true
  try {
    const data = await $fetch('/api/albums')
    moveAlbums.value = (data ?? []).filter((a: any) => a.id !== route.params.id)
  } finally {
    moveAlbumsLoading.value = false
  }
}

const moveSelected = async () => {
  if (!targetAlbumId.value || moving.value) return
  moving.value = true
  try {
    await $fetch(`/api/albums/${route.params.id}/move`, {
      method: 'POST',
      body: { ids: selectedIds.value, targetAlbumId: targetAlbumId.value },
    })
    toast.success(`已更换相册 ${selectedIds.value.length} 张照片`)
    removeFromList(selectedIds.value)
    exitBatchMode()
  } catch {
    toast.error('更换失败，请重试')
  } finally {
    moving.value = false
  }
}

const batchDeleteSelected = async () => {
  if (batchDeleting.value) return
  batchDeleting.value = true
  try {
    const { deleted } = await $fetch('/api/photos/batch-delete', {
      method: 'POST',
      body: { ids: selectedIds.value },
    })
    toast.success(`已删除 ${deleted ?? selectedIds.value.length} 张照片`)
    removeFromList(selectedIds.value)
    exitBatchMode()
  } catch {
    toast.error('删除失败，请重试')
  } finally {
    batchDeleting.value = false
  }
}

const isCover = (photo: any) => {
  const cover = album.value?.coverUrl
  if (!cover || !photo) return false
  return cover === photo.webpUrl || cover === photo.originalUrl
}

const setCoverSelected = async () => {
  if (!selectedIds.value.length || coverUpdating.value) return
  if (selectedIds.value.length > 1) {
    toast.error('只能选择一张照片设为封面')
    return
  }
  const photo = (album.value?.photos ?? []).find((p: any) => p.id === selectedIds.value[0])
  if (!photo) return
  coverUpdating.value = photo.id
  try {
    await $fetch(`/api/albums/${route.params.id}`, {
      method: 'PATCH',
      body: { photoId: photo.id },
    })
    if (album.value) album.value.coverUrl = photo.webpUrl
    toast.success('已设为封面')
  } catch {
    toast.error('设置失败，请重试')
  } finally {
    coverUpdating.value = ''
  }
}

const deleteAlbum = async () => {
  if (deleting.value) return
  deleting.value = true
  try {
    await $fetch(`/api/albums/${route.params.id}`, { method: 'DELETE' })
    await navigateTo('/albums')
  } catch {
    toast.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}
</script>
