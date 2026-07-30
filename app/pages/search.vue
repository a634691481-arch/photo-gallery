<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input
            v-model="query"
            type="text"
            placeholder="试试：去年夏天宝宝在海边..."
            class="w-full px-5 py-4 pl-12 rounded-2xl border border-ink-soft/20 bg-ink/50 text-cream placeholder:text-ink-muted/60 focus:outline-none focus:border-accent text-sm transition-colors"
            @keydown.enter="search"
          />
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-muted" />
        </div>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <div v-if="results.length" class="columns-2 sm:columns-3 lg:columns-4 gap-3 mt-8">
          <div
            v-for="(photo, idx) in results"
            :key="photo.id"
            class="group relative overflow-hidden rounded-2xl bg-cream-dark/20 dark:bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3"
            @click="lightboxIndex = idx"
          >
            <img :src="photo.webpUrl" class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105" loading="lazy" />
          </div>
        </div>

        <div v-else-if="query && !searching" class="text-center py-16">
          <img src="/illustrations/the-void.svg" alt="未找到结果" class="w-48 sm:w-56 mx-auto mb-4 opacity-80" />
          <p class="text-ink-muted text-sm">未找到相关照片</p>
        </div>

        <div v-else-if="!query" class="text-center py-16">
          <img src="/illustrations/search-empty.svg" alt="搜索" class="w-48 sm:w-56 mx-auto mb-4 opacity-80" />
          <p class="text-ink-muted text-sm max-w-xs mx-auto">
            描述你想找的内容，AI 会帮你找到最匹配的照片。
          </p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="px-3 py-1.5 text-xs rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink dark:hover:border-cream transition-colors"
              @click="query = suggestion; search()"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <PhotoLightbox
      v-if="lightboxIndex !== -1"
      :photos="results"
      :index="lightboxIndex"
      @close="lightboxIndex = -1"
    />
  </div>
</template>

<script setup lang="ts">
const query = ref('')
const searching = ref(false)
const results = ref<any[]>([])
const lightboxIndex = ref(-1)

const suggestions = ['宝宝在海边', '生日蛋糕', '徒步照片', '家庭聚餐', '下雪天']

const search = async () => {
  if (!query.value.trim()) return
  searching.value = true
  await new Promise(r => setTimeout(r, 600))
  results.value = Array.from({ length: 8 }, (_, i) => ({
    id: `s${i}`,
    webpUrl: `https://picsum.photos/seed/search${Date.now()}${i}/${400 + (i % 4) * 150}/${300 + (i % 5) * 150}`,
  }))
  searching.value = false
}
</script>
