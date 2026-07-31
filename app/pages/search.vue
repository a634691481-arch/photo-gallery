<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input
            v-model="query"
            type="text"
            placeholder="试试：去年夏天宝宝在海边..."
            class="w-full px-5 py-4 pl-12 pr-12 rounded-2xl border border-ink-soft/20 bg-ink/50 text-cream placeholder:text-ink-muted/60 focus:outline-none focus:border-accent text-sm transition-colors"
            @keydown.enter="doSearch"
          />
          <Icon
            name="heroicons:magnifying-glass"
            class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-muted pointer-events-none"
          />
          <button
            v-if="query"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-ink-soft/20 text-ink-muted hover:text-cream hover:bg-ink-soft/40 transition-colors"
            title="清空"
            @click="clearSearch"
          >
            <Icon name="heroicons:x-mark" class="size-4" />
          </button>
        </div>
      </div>
    </section>
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-7xl mx-auto">
        <PhotoSkeleton v-if="searching" :count="12" class="mt-8" />
        <div v-else-if="results.length" class="columns-2 sm:columns-3 lg:columns-4 gap-3 mt-8">
          <div
            v-for="photo in results"
            :key="photo.id"
            class="group relative overflow-hidden rounded-2xl bg-ink-soft/10 cursor-pointer break-inside-avoid mb-3"
          >
            <img
              :src="photo.webpUrl"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        <div v-else-if="query" class="text-center py-16">
          <img
            src="/illustrations/undraw_exploring_d1vd.svg"
            class="w-48 mx-auto mb-4 opacity-70"
          />
          <p class="text-ink-muted text-sm">未找到相关照片</p>
        </div>
        <div v-else class="text-center py-16">
          <img
            src="/illustrations/undraw_exploring_d1vd.svg"
            class="w-48 mx-auto mb-4 opacity-70"
          />
          <p class="text-ink-muted text-sm max-w-xs mx-auto">
            描述你想找的内容，AI 会帮你找到最匹配的照片。
          </p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <button
              v-for="s in suggestions"
              :key="s"
              class="px-3 py-1.5 text-xs rounded-full border border-ink-soft/20 text-ink-muted hover:text-ink hover:border-cream transition-colors"
              @click="selectSuggestion(s)"
            >
              {{ s }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const query = ref('')
const searching = ref(false)
const results = ref<any[]>([])
const suggestions = ['宝宝在海边', '生日蛋糕', '徒步照片', '家庭聚餐', '下雪天']

onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string' && q.trim()) {
    query.value = q
    doSearch()
  }
})

const clearSearch = () => {
  query.value = ''
  results.value = []
}

const selectSuggestion = (s: string) => {
  query.value = s
  doSearch()
}

async function doSearch() {
  if (!query.value.trim()) return
  searching.value = true
  results.value = []
  const { data } = await $fetch('/api/search', { params: { q: query.value } })
  results.value = (data as any)?.results ?? []
  searching.value = false
}
</script>
