<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-ink/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="w-full max-w-sm bg-surface dark:bg-ink rounded-2xl p-6 shadow-xl border border-cream-dark/30 dark:border-ink-soft/10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display font-medium">分享相册</h3>
          <button @click="$emit('close')" class="p-1 rounded-full hover:bg-cream-dark/30 dark:hover:bg-ink-soft/10">
            <Icon name="heroicons:x-mark" class="size-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium mb-1.5 text-ink-muted">有效期</label>
            <select v-model="expires" class="w-full px-3 py-2 text-sm rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent focus:outline-none focus:border-accent">
              <option value="1d">1 天</option>
              <option value="7d">7 天</option>
              <option value="30d">30 天</option>
              <option value="never">永久</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5 text-ink-muted">访问密码（可选）</label>
            <input v-model="password" type="text" placeholder="设置密码" class="w-full px-3 py-2 text-sm rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent focus:outline-none focus:border-accent" />
          </div>

          <div v-if="link" class="p-3 rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10">
            <p class="text-xs text-ink-muted mb-2">分享此链接：</p>
            <div class="flex items-center gap-2">
              <input :value="link" readonly class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-surface dark:bg-ink border border-cream-dark/20 dark:border-ink-soft/10 focus:outline-none" />
              <button @click="copyLink" class="px-3 py-1.5 text-xs rounded-lg bg-ink text-cream dark:bg-cream dark:text-ink shrink-0">
                {{ copied ? '已复制！' : '复制' }}
              </button>
            </div>
          </div>

          <button
            @click="generateLink"
            class="w-full py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium hover:scale-[1.02] transition-transform"
          >
            {{ link ? '重新生成' : '生成链接' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ albumId: string }>()
defineEmits<{ (e: 'close'): void }>()

const expires = ref('7d')
const password = ref('')
const link = ref('')
const copied = ref(false)

const generateLink = () => {
  link.value = `https://homealbum.com/share/${Math.random().toString(36).slice(2, 10)}`
}

const copyLink = async () => {
  await navigator.clipboard.writeText(link.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
