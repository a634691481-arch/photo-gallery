<template>
  <div>
    <section class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-2xl mx-auto">
        <div class="p-1.5 rounded-[1.75rem] bg-ink-soft/5 ring-1 ring-ink-soft/10 shadow-soft">
          <div class="p-6 sm:p-8 rounded-[1.375rem] bg-surface dark:bg-surface">
            <h1 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
              新建相册
            </h1>
            <form class="space-y-6" @submit.prevent="handleCreate">
              <div>
                <label class="block text-sm font-medium mb-2 text-ink">相册标题</label>
                <input
                  v-model="title"
                  type="text"
                  required
                  placeholder="例如：2026 暑假旅行"
                  class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-ink">描述（可选）</label>
                <textarea
                  v-model="description"
                  rows="3"
                  placeholder="这个相册是关于什么的？"
                  class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft resize-none"
                />
              </div>
              <button
                type="submit"
                :disabled="submitting"
                class="px-8 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-display font-medium text-sm transition-all duration-500 ease-soft hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {{ submitting ? '创建中...' : '创建相册' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: '创建相册' })

const title = ref('')
const description = ref('')
const submitting = ref(false)
const toast = useToast()

const handleCreate = async () => {
  if (!title.value.trim()) return
  submitting.value = true
  try {
    const res = await $fetch('/api/albums', {
      method: 'POST',
      body: { title: title.value, description: description.value },
    })
    toast?.success('相册创建成功')
    await navigateTo(`/albums/${(res as any).id}`)
  } catch (e: any) {
    toast?.error(e?.message || '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>
