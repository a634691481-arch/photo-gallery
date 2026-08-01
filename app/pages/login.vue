<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-24">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <span
          class="inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
        >
          <span class="size-2 rounded-full bg-accent" />
          家庭相册
        </span>
        <p class="mt-4 text-ink-muted text-sm">请输入密码以查看家庭照片</p>
      </div>

      <div class="p-1.5 rounded-[1.75rem] bg-ink-soft/10 ring-1 ring-ink-soft/10 shadow-soft-lg">
        <div class="p-8 rounded-[1.375rem] bg-surface dark:bg-surface">
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">密码</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  placeholder="请输入家庭密码"
                  class="w-full px-4 py-3 pr-20 rounded-xl bg-ink-soft/5 ring-1 ring-ink-soft/10 focus:ring-accent/60 focus:bg-surface text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none transition-all duration-300 ease-soft"
                  :disabled="submitting"
                />
                <div v-if="password" class="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    type="button"
                    class="p-1.5 rounded-lg text-ink-muted/60 hover:text-ink-muted transition-colors"
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
              class="w-full px-6 py-3 rounded-full text-sm font-medium transition-all duration-500 ease-soft hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed"
              :class="
                password
                  ? 'bg-accent text-cream shadow-soft hover:shadow-soft-lg'
                  : 'bg-ink/40 text-cream/60 cursor-not-allowed'
              "
              :disabled="submitting || !password"
            >
              {{ submitting ? '验证中...' : '登录' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
useHead({ title: '登录' })

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
