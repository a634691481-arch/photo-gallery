<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[var(--z-dialog)] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md overscroll-contain"
      @click.self="$emit('close')"
      @wheel.prevent="onWheel"
      @touchstart="onTouchStart"
      @touchmove.prevent
      @touchend="onTouchEnd"
    >
      <button
        class="absolute top-4 right-4 z-10 size-12 flex items-center justify-center rounded-full bg-ink/50 backdrop-blur-md hover:bg-ink/70 transition-colors duration-300 text-cream"
        aria-label="关闭预览"
        @click="$emit('close')"
      >
        <Icon name="heroicons:x-mark" class="size-6" />
      </button>
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center rounded-full bg-ink/50 backdrop-blur-md hover:bg-ink/70 transition-colors duration-300 text-cream"
        aria-label="上一张"
        @click.stop="prev"
      >
        <Icon name="heroicons:chevron-left" class="size-6" />
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center rounded-full bg-ink/50 backdrop-blur-md hover:bg-ink/70 transition-colors duration-300 text-cream"
        aria-label="下一张"
        @click.stop="next"
      >
        <Icon name="heroicons:chevron-right" class="size-6" />
      </button>

      <video
        v-if="isVideoPhoto"
        :src="currentPhoto?.videoUrl"
        controls
        autoplay
        playsinline
        class="max-w-[88vw] max-h-[82vh] rounded-lg bg-black"
      />
      <img
        v-else
        :src="currentPhoto?.webpUrl || currentPhoto?.url"
        :alt="currentPhoto?.fileName || currentPhoto?.title"
        class="max-w-[88vw] max-h-[82vh] object-contain rounded-lg"
      />

      <div
        class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-ink/70 backdrop-blur-xl rounded-full px-5 py-2.5 ring-1 ring-cream/10 shadow-soft-lg"
      >
        <span class="text-cream/60 text-xs">{{ index + 1 }} / {{ photos.length }}</span>
        <div class="w-px h-4 bg-cream/20" />
        <a
          v-if="currentPhoto?.id || currentPhoto?.webpUrl || currentPhoto?.url"
          :href="
            currentPhoto.id
              ? `/api/photos/${currentPhoto.id}/download`
              : currentPhoto.webpUrl || currentPhoto.url
          "
          download
          class="text-cream/70 hover:text-cream transition-colors text-xs flex items-center gap-1"
          ><Icon name="heroicons:arrow-down-tray" class="size-4" />下载</a
        >
        <div class="w-px h-4 bg-cream/20" />
        <button
          class="text-cream/70 hover:text-green-400 transition-colors flex items-center gap-1"
          :class="{ 'text-green-400': autoplay }"
          @click="toggleAutoplay"
        >
          <Icon
            :name="autoplay ? 'heroicons:pause-circle' : 'heroicons:play-circle'"
            class="size-4"
          />
          <span class="text-xs">{{ autoplay ? '播放中' : '自动' }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: Array<{
    id?: string
    webpUrl?: string
    url?: string
    fileName?: string
    title?: string
    videoUrl?: string | null
    isVideo?: number | boolean | null
  }>
  visible: boolean
  modelValue?: number
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:modelValue', v: number): void
}>()

const index = ref(props.modelValue ?? 0)
const autoplay = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const currentPhoto = computed(() => props.photos[index.value] ?? null)

const isVideoPhoto = computed(() => Boolean(currentPhoto.value?.isVideo))

watch(
  () => props.visible,
  (v) => {
    if (!v) stopAutoplay()
  },
)
watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) index.value = v
  },
)
watch(isVideoPhoto, (v) => {
  if (v) stopAutoplay()
})

const prev = () => {
  if (index.value > 0) {
    index.value--
    emit('update:modelValue', index.value)
  }
}
const next = () => {
  if (index.value < props.photos.length - 1) {
    index.value++
    emit('update:modelValue', index.value)
  }
}

const toggleAutoplay = () => {
  autoplay.value = !autoplay.value
  if (autoplay.value) {
    timer = setInterval(next, 3000)
  } else if (timer) {
    clearInterval(timer)
    timer = null
  }
}
const stopAutoplay = () => {
  autoplay.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (!props.visible) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

let touchStartX = 0
let touchStartY = 0

const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    if (e.deltaX > 0) next()
    else prev()
  } else {
    if (e.deltaY > 0) next()
    else prev()
  }
}

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 50) return
  if (absDx > absDy) {
    if (dx > 0) prev()
    else next()
  } else {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  stopAutoplay()
})
</script>
