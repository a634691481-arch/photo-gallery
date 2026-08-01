<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[var(--z-dialog)] bg-cream/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
      @click.self="close"
      @keydown.enter.prevent="create"
    >
      <div
        class="w-full max-w-sm p-1.5 rounded-[1.75rem] bg-ink-soft/10 ring-1 ring-ink-soft/10 shadow-soft-lg"
      >
        <div class="bg-surface dark:bg-surface rounded-[1.375rem] p-6 text-ink dark:text-cream">
          <h3 class="font-display font-medium mb-4">新建相册</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium mb-1.5 text-ink-muted">相册名称</label>
              <input
                v-model="title"
                type="text"
                placeholder="例如：2026 暑假旅行"
                class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5 text-ink-muted">描述（可选）</label>
              <input
                v-model="desc"
                type="text"
                placeholder="简单描述一下这个相册"
                class="w-full px-4 py-3 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none transition-all duration-300 ease-soft"
              />
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-full text-sm text-ink-muted hover:text-ink hover:bg-ink-soft/10 transition-colors duration-300"
              @click="close"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] disabled:opacity-50"
              :disabled="!title.trim() || creating"
              @click="create"
            >
              {{ creating ? '创建中...' : '创建' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'created', id: string): void
}>()

const toast = useToast()
const title = ref('')
const desc = ref('')
const creating = ref(false)

useBodyLock(computed(() => props.visible))

const close = () => emit('update:visible', false)

const create = async () => {
  if (!title.value.trim() || creating.value) return
  creating.value = true
  try {
    const { id } = await $fetch('/api/albums', {
      method: 'POST',
      body: { title: title.value.trim(), description: desc.value.trim() || undefined },
    })
    emit('created', id)
    close()
    title.value = ''
    desc.value = ''
    toast.success('相册创建成功')
  } catch {
    toast.error('创建失败，请重试')
  } finally {
    creating.value = false
  }
}
</script>
