export function useAuth() {
  const isAuthenticated = useState('auth:authenticated', () => false)
  const loading = useState('auth:loading', () => true)
  const error = ref('')
  const router = useRouter()

  const checkAuth = () => {
    const cookie = useCookie('family_auth')
    isAuthenticated.value = cookie.value === '1'
    loading.value = false
  }

  const login = async (password: string) => {
    error.value = ''
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { password },
      })
      if (data.success) {
        isAuthenticated.value = true
        await router.push('/')
        return true
      }
      error.value = '密码错误'
      return false
    } catch {
      error.value = '登录失败，请重试'
      return false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    isAuthenticated.value = false
    router.push('/login')
  }

  if (import.meta.client) {
    checkAuth()
  }

  return { isAuthenticated, loading, error, login, logout }
}
