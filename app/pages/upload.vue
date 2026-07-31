<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2rem, 4vw, 3.5rem)"
        >
          上传照片
        </h1>
        <p class="mt-3 text-ink-muted">把照片拖到这里，剩下的交给我们。</p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <div
          ref="dropZone"
          class="relative rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center transition-all duration-300 cursor-pointer"
          :class="
            isDragging
              ? 'border-accent bg-cream-dark/30 dark:bg-ink-soft/10'
              : 'border-cream-dark/40 dark:border-ink-soft/20 hover:border-ink/50 dark:hover:border-cream/50'
          "
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
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-cream-dark/30 dark:bg-ink-soft/10 flex items-center justify-center"
            >
              <Icon name="heroicons:cloud-arrow-up" class="size-8 text-ink-muted" />
            </div>
            <div>
              <p class="font-display font-medium text-lg">拖拽照片到此处</p>
              <p class="text-sm text-ink-muted mt-1">或点击浏览文件</p>
            </div>
          </div>
        </div>

        <div v-if="files.length" class="mt-8 space-y-3 pb-28">
          <div
            v-for="(file, i) in files"
            :key="file.name"
            class="flex items-center gap-4 p-3 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10"
          >
            <div
              class="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark/30 dark:bg-ink-soft/20 shrink-0"
            >
              <img v-if="file.preview" :src="file.preview" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ file.name }}</p>
              <p class="text-xs text-ink-muted">{{ formatSize(file.size) }}</p>
            </div>
            <div class="flex items-center gap-2">
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
        </div>
      </div>
    </section>

    <div
      v-if="files.length"
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-ink-soft/10 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div v-if="uploading" class="h-1 bg-ink-soft/15">
        <div
          class="h-full bg-accent transition-all duration-300"
          :style="{ width: `${totalProgress}%` }"
        />
      </div>
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
        <select
          v-model="selectedAlbum"
          class="flex-1 min-w-0 px-3 py-2 rounded-xl border border-ink-soft/20 bg-ink-soft/20 text-sm text-ink focus:outline-none focus:border-accent transition-colors cursor-pointer appearance-none"
          style="color-scheme: dark"
        >
          <option value="" class="bg-surface text-ink-muted">不加入相册</option>
          <option v-for="a in albums" :key="a.id" :value="a.id" class="bg-surface text-ink">
            {{ a.title }}
          </option>
        </select>
        <button
          class="shrink-0 size-9 rounded-full border border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink/40 flex items-center justify-center transition-colors"
          title="新建相册"
          @click="showCreateAlbum = true"
        >
          <Icon name="heroicons:plus" class="size-4" />
        </button>
        <button
          class="shrink-0 px-5 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="uploading || !files.length"
          @click="startUpload"
        >
          {{ uploading ? `${totalProgress}%` : `上传 ${files.length} 张` }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showCreateAlbum"
        class="fixed inset-0 z-[100] bg-cream/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="showCreateAlbum = false"
        @keydown.enter.prevent="createAlbum"
      >
        <div
          class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10 text-ink dark:text-cream"
        >
          <h3 class="font-display font-medium mb-4">新建相册</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5 text-ink-muted">相册名称</label>
              <input
                v-model="newAlbumTitle"
                type="text"
                placeholder="例如：2026 暑假旅行"
                class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-transparent text-sm text-ink dark:text-cream placeholder:text-ink-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5 text-ink-muted">描述（可选）</label>
              <input
                v-model="newAlbumDesc"
                type="text"
                placeholder="简单描述一下这个相册"
                class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-transparent text-sm text-ink dark:text-cream placeholder:text-ink-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-sm text-ink-muted hover:text-ink transition-colors"
              @click="showCreateAlbum = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              :disabled="!newAlbumTitle.trim() || creatingAlbum"
              @click="createAlbum"
            >
              {{ creatingAlbum ? '创建中...' : '创建' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

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
const newAlbumTitle = ref('')
const newAlbumDesc = ref('')
const creatingAlbum = ref(false)

const createAlbum = async () => {
  if (!newAlbumTitle.value.trim() || creatingAlbum.value) return
  creatingAlbum.value = true
  try {
    const { id } = await $fetch('/api/albums', {
      method: 'POST',
      body: {
        title: newAlbumTitle.value.trim(),
        description: newAlbumDesc.value.trim() || undefined,
      },
    })
    await refreshAlbums()
    selectedAlbum.value = id
    showCreateAlbum.value = false
    newAlbumTitle.value = ''
    newAlbumDesc.value = ''
    toast.success('相册创建成功')
  } catch {
    toast.error('创建失败，请重试')
  } finally {
    creatingAlbum.value = false
  }
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

const startUpload = async () => {
  const { ok, fail } = await uploadAll(selectedAlbum.value || undefined)
  if (ok > 0 && fail === 0) {
    toast.success(`上传成功 ${ok} 张照片`)
    clear()
  } else if (ok > 0 && fail > 0) toast.error(`成功 ${ok} 张，失败 ${fail} 张，可重试`)
  else if (fail > 0) toast.error(`全部失败（${fail} 张），可点击重试`)
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
