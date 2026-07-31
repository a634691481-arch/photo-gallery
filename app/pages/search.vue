<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-10">
          <h1
            class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
            style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
          >
            智能搜索
          </h1>
          <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">
            描述你想找的内容，AI 会帮你找到最匹配的照片。
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input
              v-model="query"
              type="text"
              placeholder="试试：去年夏天宝宝在海边..."
              class="w-full px-5 py-4 pl-12 pr-12 rounded-2xl border border-ink-soft/20 bg-ink/50 text-cream placeholder:text-ink-muted/60 focus:outline-none focus:border-accent text-sm transition-colors"
              @keydown.enter="search"
            />
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-muted"
            />
            <button
              v-if="query"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-ink-muted/60 hover:text-ink-muted dark:hover:text-cream/70 transition-colors"
              title="清空"
              @click="query = ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            class="shrink-0 px-10 py-4 rounded-2xl bg-ink text-cream text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="searching || !query.trim()"
            @click="search"
          >
            {{ searching ? '搜索' : '搜索' }}
          </button>
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
            <img
              :src="photo.webpUrl"
              class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        <EmptyState v-if="!results.length && !searching">
          <template v-if="query">
            <p class="text-ink-muted text-sm">未找到相关照片</p>
          </template>
          <template v-else>
            <p class="text-ink-muted text-sm">描述你想找的内容，AI 会帮你找到最匹配的照片。</p>
            <div class="mt-4 flex flex-wrap justify-center gap-2">
              <button
                v-for="suggestion in suggestions"
                :key="suggestion"
                class="px-3 py-1.5 text-xs rounded-full border border-cream-dark/30 dark:border-ink-soft/20 text-ink-muted hover:text-ink hover:border-ink dark:hover:border-cream transition-colors"
                @click="useSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </template>
        </EmptyState>
      </div>
    </section>

    <PhotoPreview
      :photos="results"
      :visible="lightboxIndex !== -1"
      :model-value="lightboxIndex"
      @update:model-value="lightboxIndex = $event"
      @close="lightboxIndex = -1"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const query = ref('')
const searching = ref(false)
const results = ref<any[]>([])
const lightboxIndex = ref(-1)

const suggestions = ['宝宝在海边', '生日蛋糕', '徒步照片', '家庭聚餐', '下雪天']

const search = async () => {
  if (!query.value.trim()) return
  searching.value = true
  await new Promise((r) => setTimeout(r, 600))
  results.value = Array.from({ length: 8 }, (_, i) => ({
    id: `s${i}`,
    webpUrl: `https://picsum.photos/seed/search${Date.now()}${i}/${400 + (i % 4) * 150}/${300 + (i % 5) * 150}`,
  }))
  searching.value = false
}

const useSuggestion = (suggestion: string) => {
  query.value = suggestion
  search()
}
</script>
