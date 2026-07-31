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

        <div v-if="files.length" class="mt-8 space-y-3">
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

        <div v-if="files.length" class="mt-6">
          <label class="block text-sm font-medium mb-2">添加到相册</label>
          <select
            v-model="selectedAlbum"
            class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-ink-soft/20 text-ink focus:outline-none focus:border-accent text-sm transition-colors cursor-pointer appearance-none"
            style="color-scheme: dark"
          >
            <option value="" class="bg-surface text-ink-muted">不加入相册</option>
            <option v-for="a in albums" :key="a.id" :value="a.id" class="bg-surface text-ink">
              {{ a.title }}
            </option>
          </select>
        </div>

        <div v-if="files.length" class="mt-6 flex justify-center">
          <button
            :disabled="uploading"
            class="px-8 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-display font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="startUpload"
          >
            {{ uploading ? '上传中...' : `上传 ${files.length} 张照片` }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { files, uploading, addFiles, removeFile, uploadAll } = useUpload()
const isDragging = ref(false)
const selectedAlbum = ref('')
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const { data: albumData } = useFetch('/api/albums')
const albums = computed(() => (albumData.value as any[]) ?? [])

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
  if (ok > 0 && fail === 0) toast.success(`上传成功 ${ok} 张照片`)
  else if (ok > 0 && fail > 0) toast.error(`成功 ${ok} 张，失败 ${fail} 张，可重试`)
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
