export function useAuth() {
  const user = useState<any>('user', () => null)
  const loading = useState('auth:loading', () => true)

  const login = async () => {
    const { data } = await useFetch('/api/auth/wechat')
    if (data.value?.url) {
      window.location.href = data.value.url
    }
  }

  const logout = async () => {
    await useFetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAuthenticated = computed(() => !!user.value)

  return { user, loading, login, logout, isAdmin, isAuthenticated }
}
