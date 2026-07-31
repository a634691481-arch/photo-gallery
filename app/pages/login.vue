<template>
  <div class="min-h-screen flex items-center justify-end px-4 py-24">
    <div class="w-full max-w-sm mr-4 lg:mr-20">
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
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入家庭密码"
                class="w-full px-4 py-3 pr-20 rounded-xl border border-cream-dark/30 dark:border-ink-soft/10 bg-transparent text-sm text-ink dark:text-cream placeholder:text-ink-muted/60 focus:outline-none focus:border-accent transition-colors"
                :disabled="submitting"
              />
              <div v-if="password" class="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-ink-muted/60 hover:text-ink-muted dark:hover:text-cream/70 transition-colors"
                  :title="showPassword ? '隐藏密码' : '查看密码'"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                    class="size-4"
                  />
                </button>
              </div>
            </div>
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
  layout: 'blank',
})

const { login } = useAuth()

const password = ref('')
const submitting = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

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
