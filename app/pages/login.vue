<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-24">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <span class="text-2xl font-display font-semibold tracking-tight">家庭相册</span>
        <p class="mt-3 text-ink-muted text-sm">请输入密码以查看家庭照片</p>
      </div>

      <div
        class="p-8 rounded-2xl bg-surface dark:bg-ink border border-cream-dark/30 dark:border-ink-soft/10"
      >
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入家庭密码"
              class="w-full px-4 py-3 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm text-ink dark:text-cream placeholder:text-ink-muted/60 focus:outline-none focus:border-accent transition-colors"
              :disabled="submitting"
            />
          </div>

          <p v-if="errorMsg" class="text-xs text-red-500 mb-4">{{ errorMsg }}</p>

          <button
            type="submit"
            class="w-full px-6 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="submitting || !password"
          >
            {{ submitting ? '验证中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { login } = useAuth()

const password = ref('')
const submitting = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!password.value || submitting.value) return
  submitting.value = true
  errorMsg.value = ''

  const success = await login(password.value)
  if (!success) {
    errorMsg.value = '密码错误，请重试'
    password.value = ''
  }

  submitting.value = false
}
</script>
