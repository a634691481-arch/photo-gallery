<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2rem, 4vw, 3.5rem);">
          上传照片
        </h1>
        <p class="mt-3 text-ink-muted">
          把照片拖到这里，剩下的交给我们。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <div
          ref="dropZone"
          class="relative rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center transition-all duration-300 cursor-pointer"
          :class="isDragging
            ? 'border-accent bg-cream-dark/30 dark:bg-ink-soft/10'
            : 'border-cream-dark/40 dark:border-ink-soft/20 hover:border-ink/50 dark:hover:border-cream/50'"
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
            <div class="w-16 h-16 rounded-2xl bg-cream-dark/30 dark:bg-ink-soft/10 flex items-center justify-center">
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
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark/30 dark:bg-ink-soft/20 shrink-0">
              <img v-if="file.preview" :src="file.preview" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ file.name }}</p>
              <p class="text-xs text-ink-muted">{{ formatSize(file.size) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="file.status === 'uploading'" class="text-xs text-ink-muted">{{ file.progress }}%</span>
              <span v-else-if="file.status === 'done'" class="text-xs text-green-500">完成</span>
              <span v-else-if="file.status === 'error'" class="text-xs text-red-500">失败</span>
              <button
                v-if="file.status === 'pending'"
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
            class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-transparent text-ink focus:outline-none focus:border-accent text-sm transition-colors cursor-pointer"
          >
            <option value="">不加入相册</option>
            <option v-for="a in albums" :key="a.id" :value="a.id">{{ a.title }}</option>
          </select>
        </div>

        <div v-if="files.length" class="mt-6 flex justify-center">
          <button
            @click="startUpload"
            :disabled="uploading"
            class="px-8 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-display font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? '上传中...' : `上传 ${files.length} 张照片` }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const files = ref<UploadFile[]>([])
const isDragging = ref(false)
const uploading = ref(false)
const selectedAlbum = ref('')
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const albums = [
  { id: '1', title: '2026 暑假旅行' },
  { id: '2', title: '宝宝第一步' },
]

interface UploadFile {
  name: string
  size: number
  preview: string | null
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const addFiles = (fileList: FileList) => {
  for (const f of Array.from(fileList)) {
    files.value.push({
      name: f.name,
      size: f.size,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      status: 'pending',
      progress: 0,
    })
  }
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

const removeFile = (i: number) => {
  const f = files.value[i]
  if (f.preview) URL.revokeObjectURL(f.preview)
  files.value.splice(i, 1)
}

const startUpload = async () => {
  uploading.value = true
  for (const f of files.value) {
    if (f.status === 'done') continue
    f.status = 'uploading'
    for (let p = 0; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 200))
      f.progress = p
    }
    f.status = 'done'
    f.progress = 100
  }
  uploading.value = false
}
</script>
