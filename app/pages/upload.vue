<template>
  <div>
    <section class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <span
          class="inline-block px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted mb-6"
        >
          添加回忆
        </span>
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2rem, 4vw, 3.5rem)"
        >
          上传照片
        </h1>
        <p class="mt-5 text-ink-muted">把照片拖到这里，剩下的交给我们。</p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <div
          ref="dropZone"
          class="p-1.5 rounded-[1.75rem] bg-ink-soft/5 ring-1 ring-ink-soft/10 transition-all duration-500 ease-soft cursor-pointer"
          :class="isDragging ? 'ring-accent/60 shadow-soft-lg' : 'shadow-soft'"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragover.prevent="isDragging = true"
          @drop.prevent="handleDrop"
          @click="triggerInput"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,video/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <div
            class="rounded-[1.375rem] border-2 border-dashed border-ink-soft/15 dark:border-ink-soft/10 p-12 sm:p-16 text-center transition-all duration-500 ease-soft"
            :class="isDragging ? 'border-accent/50 bg-accent/5' : 'hover:border-ink-soft/30'"
          >
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-16 h-16 rounded-2xl bg-cream-dark/40 dark:bg-ink-soft/10 flex items-center justify-center shadow-soft"
              >
                <Icon name="heroicons:cloud-arrow-up" class="size-8 text-ink-muted" />
              </div>
              <div>
                <p class="font-display font-medium text-lg">拖拽照片到此处</p>
                <p class="text-sm text-ink-muted mt-1">或点击浏览文件</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="files.length" class="mt-8 space-y-3 pb-28">
          <div
            v-for="(file, i) in files"
            :key="file.name"
            class="p-3 rounded-2xl bg-cream-dark/40 dark:bg-ink-soft/10 ring-1 ring-ink-soft/5"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark/40 dark:bg-ink-soft/20 shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="file.preview"
                  :src="file.preview"
                  alt=""
                  class="w-full h-full object-cover"
                />
                <Icon
                  v-else-if="file.file.type.startsWith('video/')"
                  name="heroicons:film"
                  class="size-5 text-ink-muted"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ file.name }}</p>
                <p class="text-xs text-ink-muted">{{ formatSize(file.size) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="file.status === 'done' && file.meta"
                  class="px-3 py-1 text-xs rounded-full bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors"
                  @click="toggleMeta(i)"
                >
                  {{ expandedMeta === i ? '收起信息' : '查看信息' }}
                </button>
                <span v-if="file.status === 'uploading'" class="text-xs text-ink-muted"
                  >{{ file.progress }}%</span
                >
                <span v-else-if="file.status === 'done'" class="text-xs text-green-500">完成</span>
                <span v-else-if="file.status === 'error'" class="text-xs text-red-500">失败</span>
                <button
                  v-if="file.status === 'error'"
                  class="px-2 py-1 text-xs rounded-full bg-ink-soft/20 text-ink hover:bg-ink-soft/40 transition-colors"
                  @click="retryFile(i)"
                >
                  重试
                </button>
                <button
                  v-if="file.status === 'pending' || file.status === 'error'"
                  class="p-1 rounded-full hover:bg-cream-dark/40 dark:hover:bg-ink-soft/20 transition-colors"
                  @click="removeFile(i)"
                >
                  <Icon name="heroicons:x-mark" class="size-4" />
                </button>
              </div>
            </div>

            <div
              v-if="expandedMeta === i && file.meta"
              class="mt-3 pt-3 border-t border-ink-soft/10 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs"
            >
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">拍摄时间</span>
                <span class="text-ink text-right">{{ formatTakenAt(file.meta.takenAt) }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">相机</span>
                <span class="text-ink text-right truncate">
                  {{
                    [file.meta.cameraMake, file.meta.cameraModel].filter(Boolean).join(' ') || '—'
                  }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">尺寸</span>
                <span class="text-ink text-right">
                  {{
                    file.meta.width && file.meta.height
                      ? `${file.meta.width} × ${file.meta.height}`
                      : '—'
                  }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">大小</span>
                <span class="text-ink text-right">
                  {{ file.meta.fileSize ? formatSize(file.meta.fileSize) : '—' }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">ISO</span>
                <span class="text-ink text-right">{{ file.meta.exif?.iso ?? '—' }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">光圈</span>
                <span class="text-ink text-right">
                  {{ file.meta.exif?.fNumber ? `f/${file.meta.exif.fNumber}` : '—' }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">快门</span>
                <span class="text-ink text-right">
                  {{ formatExposure(file.meta.exif?.exposureTime) }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">焦距</span>
                <span class="text-ink text-right">
                  {{ file.meta.exif?.focalLength ? `${file.meta.exif.focalLength} mm` : '—' }}
                </span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-ink-muted shrink-0">GPS</span>
                <span class="text-ink text-right">
                  {{
                    file.meta.latitude != null && file.meta.longitude != null
                      ? `${file.meta.latitude.toFixed(5)}, ${file.meta.longitude.toFixed(5)}`
                      : '—'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      class="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] bg-surface/85 backdrop-blur-xl shadow-[0_-8px_40px_rgb(43_37_32/0.08)]"
    >
      <div v-if="uploading" class="h-1 bg-ink-soft/10">
        <div
          class="h-full bg-accent transition-all duration-500 ease-soft"
          :style="{ width: `${totalProgress}%` }"
        />
      </div>
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
        <select
          v-model="selectedAlbum"
          aria-label="选择要加入的相册"
          class="flex-1 min-w-0 px-3 py-2 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 text-sm text-ink focus:outline-none focus:ring-accent/60 transition-all duration-300 cursor-pointer appearance-none"
        >
          <option value="" class="bg-surface text-ink-muted">不加入相册</option>
          <option v-for="a in albums" :key="a.id" :value="a.id" class="bg-surface text-ink">
            {{ a.title }}
          </option>
        </select>
        <button
          class="shrink-0 size-9 rounded-full bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted hover:text-ink hover:bg-ink-soft/10 flex items-center justify-center transition-all duration-300"
          title="新建相册"
          @click="showCreateAlbum = true"
        >
          <Icon name="heroicons:plus" class="size-4" />
        </button>
        <button
          class="shrink-0 px-5 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="uploading || !files.length"
          @click="startUpload"
        >
          {{
            uploading ? `${totalProgress}%` : files.length ? `上传 ${files.length} 项` : '上传照片'
          }}
        </button>
      </div>
    </div>

    <AlbumCreateDialog v-model:visible="showCreateAlbum" @created="onAlbumCreated" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: '上传照片' })

const { files, uploading, addFiles, removeFile, uploadAll, clear } = useUpload()

const totalProgress = computed(() => {
  const total = files.value.reduce((s, f) => s + f.size, 0)
  if (!total) return 0
  const done = files.value.reduce((s, f) => {
    const pct = f.status === 'done' ? 100 : f.status === 'error' ? 0 : f.progress
    return s + (f.size * pct) / 100
  }, 0)
  return Math.min(100, Math.round((done / total) * 100))
})
const isDragging = ref(false)
const route = useRoute()
const selectedAlbum = ref((route.query.album as string) || '')
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const { data: albumData, refresh: refreshAlbums } = useFetch('/api/albums')
const albums = computed(() => (albumData.value as any[]) ?? [])
const showCreateAlbum = ref(false)

const onAlbumCreated = (id: string) => {
  selectedAlbum.value = id
  refreshAlbums()
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const expandedMeta = ref<number | null>(null)

const toggleMeta = (i: number) => {
  expandedMeta.value = expandedMeta.value === i ? null : i
}

const formatTakenAt = (t?: string) => {
  if (!t) return '—'
  const d = new Date(t.replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return t
  return d.toLocaleString('zh-CN', { hour12: false })
}

const formatExposure = (v?: number | null) => {
  if (v == null || v <= 0) return '—'
  if (v >= 1) return `${v}s`
  return `1/${Math.round(1 / v)}s`
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(input.files)
}

const triggerInput = () => fileInput.value?.click()

const toast = useToast()

useBodyLock(showCreateAlbum)

const startUpload = async () => {
  const { ok, fail } = await uploadAll(selectedAlbum.value || undefined)
  if (ok > 0 && fail === 0) {
    toast.success(`上传成功 ${ok} 项`)
    clear()
  } else if (ok > 0 && fail > 0) toast.error(`成功 ${ok} 项，失败 ${fail} 项，可重试`)
  else if (fail > 0) toast.error(`全部失败（${fail} 项），可点击重试`)
}

const retryFile = (i: number) => {
  if (uploading.value) return
  const f = files.value[i]
  if (!f) return
  f.status = 'pending'
  f.progress = 0
  startUpload()
}
</script>
