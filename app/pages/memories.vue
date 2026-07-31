<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h1
            class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
            style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
          >
            纪念日与回忆
          </h1>
          <button
            class="shrink-0 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            @click="showForm = !showForm"
          >
            <span class="flex items-center gap-1.5">
              <Icon name="heroicons:plus" class="size-4" />添加纪念日
            </span>
          </button>
        </div>
        <p class="text-ink-muted text-base max-w-lg">
          家庭的重要日子与提醒，不错过任何一个特别的时刻。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <form
          v-if="showForm"
          class="mb-6 p-5 sm:p-6 rounded-2xl bg-ink-soft/10 space-y-4"
          @submit.prevent="handleCreate"
        >
          <div>
            <label class="block text-sm font-medium mb-2">标题</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="例如：宝宝 Emma 生日"
              class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-transparent text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent text-sm transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">日期</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-ink-soft/10 text-ink focus:outline-none focus:border-accent text-sm transition-colors"
              style="color-scheme: dark"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">描述（可选）</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="这一天有什么特别的？"
              class="w-full px-4 py-3 rounded-xl border border-ink-soft/20 bg-transparent text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent text-sm transition-colors"
            />
          </div>
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {{ submitting ? '保存中...' : '保存' }}
            </button>
            <button
              type="button"
              class="px-6 py-2.5 rounded-full text-sm text-ink-muted hover:text-ink transition-colors"
              @click="showForm = false"
            >
              取消
            </button>
          </div>
        </form>

        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <EmptyState v-else-if="!anniversaries.length" text="还没有纪念日，点右上角添加一个吧" />
        <div v-else class="space-y-3">
          <div
            v-for="item in anniversaries"
            :key="item.id"
            class="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-ink-soft/10 hover:bg-ink-soft/20 transition-colors group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-ink-soft/20 flex items-center justify-center shrink-0"
            >
              <span class="font-display text-lg font-semibold">{{ item.day }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-display font-medium text-sm">{{ item.title }}</p>
              <p class="text-xs text-ink-muted mt-0.5">
                {{ item.month }}月{{ item.year ? ' ' + item.year : '' }}
                <span
                  v-if="item.age"
                  class="ml-2 px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs"
                  >{{ item.age }} 岁</span
                >
              </p>
            </div>
            <span
              v-if="item.comingSoon"
              class="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >还有 {{ item.daysLeft }} 天</span
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data, pending, refresh } = useFetch('/api/memories')
const anniversaries = computed(() => data.value ?? [])

const showForm = ref(false)
const submitting = ref(false)
const form = reactive({ title: '', date: '', description: '' })
const toast = useToast()

const handleCreate = async () => {
  if (!form.title.trim() || !form.date) return
  submitting.value = true
  try {
    await $fetch('/api/memories', {
      method: 'POST',
      body: { title: form.title, date: form.date, description: form.description },
    })
    toast.success('纪念日已添加')
    form.title = ''
    form.date = ''
    form.description = ''
    showForm.value = false
    await refresh()
  } catch (e: any) {
    toast.error(e?.message || '添加失败')
  } finally {
    submitting.value = false
  }
}
</script>
