<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <div
          class="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden ring-2 ring-cream-dark/30 dark:ring-ink-soft/10 mb-6"
        >
          <img :src="person.avatar" class="w-full h-full object-cover" />
        </div>
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          {{ person.name }}
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">{{ photos.length }} 张照片</p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <div class="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
          <div
            v-for="(photo, idx) in photos"
            :key="photo.id"
            class="group relative overflow-hidden rounded-2xl bg-cream-dark/20 dark:bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3 sm:mb-4"
            @click="openPreview(idx)"
          >
            <img
              :src="photo.webpUrl"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <PhotoPreview
      :photos="photos"
      :visible="previewVisible"
      :model-value="previewIndex"
      @update:model-value="previewIndex = $event"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const people: Record<string, { name: string; avatar: string }> = {
  '1': { name: '宝宝 Emma', avatar: 'https://picsum.photos/seed/face1/200/200' },
  '2': { name: '妈妈', avatar: 'https://picsum.photos/seed/face2/200/200' },
  '3': { name: '爸爸', avatar: 'https://picsum.photos/seed/face3/200/200' },
  '4': { name: '奶奶', avatar: 'https://picsum.photos/seed/face4/200/200' },
}
const person = computed(() => people[route.params.id as string] || people['1'])
const previewVisible = ref(false)
const previewIndex = ref(0)

const openPreview = (idx: number) => {
  previewIndex.value = idx
  previewVisible.value = true
}

const photos = Array.from({ length: 20 }, (_, i) => ({
  id: `p${i}`,
  webpUrl: `https://picsum.photos/seed/face${route.params.id}${i}/${400 + (i % 4) * 150}/${300 + (i % 5) * 150}`,
}))
</script>
