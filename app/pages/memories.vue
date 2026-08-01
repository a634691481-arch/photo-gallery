<template>
  <div>
    <section class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between gap-4 mb-6">
          <h1
            class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
            style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
          >
            纪念日与回忆
          </h1>
          <button
            class="shrink-0 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-500 ease-soft hover:scale-105 active:scale-95 shadow-soft"
            @click="showForm = !showForm"
          >
            <span class="flex items-center gap-1.5">
              <Icon name="heroicons:plus" class="size-4" />添加纪念日
            </span>
          </button>
        </div>
        <p class="text-ink-muted text-base max-w-lg leading-relaxed">
          家庭的重要日子与提醒，不错过任何一个特别的时刻。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <form
          v-if="showForm"
          class="mb-8 p-1.5 rounded-[1.75rem] bg-ink-soft/5 ring-1 ring-ink-soft/10 shadow-soft"
          @submit.prevent="handleCreate"
        >
          <div class="p-5 sm:p-6 rounded-[1.375rem] bg-surface dark:bg-surface space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">标题</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="例如：宝宝 Emma 生日"
                class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">日期</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink focus:outline-none transition-all duration-300 ease-soft"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">描述（可选）</label>
              <input
                v-model="form.description"
                type="text"
                placeholder="这一天有什么特别的？"
                class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft"
              />
            </div>
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-full bg-ink text-cream text-sm font-medium transition-all duration-500 ease-soft hover:scale-105 disabled:opacity-50"
              >
                {{ submitting ? '保存中...' : '保存' }}
              </button>
              <button
                type="button"
                class="px-6 py-2.5 rounded-full text-sm text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors duration-300"
                @click="showForm = false"
              >
                取消
              </button>
            </div>
          </div>
        </form>

        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <EmptyState v-else-if="!anniversaries.length" text="还没有纪念日，点右上角添加一个吧" />
        <div v-else class="space-y-3">
          <div
            v-for="item in anniversaries"
            :key="item.id"
            class="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-cream-dark/40 dark:bg-ink-soft/10 ring-1 ring-ink-soft/5 shadow-soft transition-all duration-500 ease-soft hover:shadow-soft-lg group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-ink-soft/10 ring-1 ring-ink-soft/10 flex items-center justify-center shrink-0"
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
            <button
              class="shrink-0 size-9 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 group-active:opacity-100 focus-visible:opacity-100 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all duration-300 ease-soft"
              :title="`删除 ${item.title}`"
              @click="askDelete(item)"
            >
              <Icon name="heroicons:trash" class="size-4" />
            </button>
          </div>
        </div>

        <Teleport to="body">
          <div
            v-if="deleteTarget"
            class="fixed inset-0 z-[var(--z-dialog)] bg-cream/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
            @click.self="deleteTarget = null"
          >
            <div
              class="w-full max-w-sm p-1.5 rounded-[1.75rem] bg-ink-soft/10 ring-1 ring-ink-soft/10 shadow-soft-lg"
            >
              <div
                class="bg-surface dark:bg-surface rounded-[1.375rem] p-6 text-ink dark:text-cream"
              >
                <h3 class="font-display font-medium mb-2">删除纪念日</h3>
                <p class="text-sm text-ink-muted leading-relaxed">
                  确定删除「{{ deleteTarget.title }}」吗？删除后无法恢复。
                </p>
                <div class="mt-6 flex gap-3">
                  <button
                    class="flex-1 px-4 py-2.5 rounded-full text-sm text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors duration-300"
                    @click="deleteTarget = null"
                  >
                    取消
                  </button>
                  <button
                    class="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-cream text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    :disabled="deleting"
                    @click="confirmDelete"
                  >
                    {{ deleting ? '删除中...' : '删除' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: '纪念日' })

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

const deleteTarget = ref<any>(null)
const deleting = ref(false)
useBodyLock(deleteTarget)

const askDelete = (item: any) => {
  deleteTarget.value = item
}

const confirmDelete = async () => {
  if (!deleteTarget.value || deleting.value) return
  deleting.value = true
  try {
    await $fetch(`/api/memories/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.success('纪念日已删除')
    deleteTarget.value = null
    await refresh()
  } catch (e: any) {
    toast.error(e?.message || '删除失败')
  } finally {
    deleting.value = false
  }
}
</script>
