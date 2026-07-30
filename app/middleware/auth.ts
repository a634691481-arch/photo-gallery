import { getCookie } from 'h3'

export default defineNuxtRouteMiddleware(() => {
  const isAuth = useState('auth:authenticated')
  if (isAuth.value) return

  const event = useRequestEvent()
  const cookieValue = event ? getCookie(event, 'family_auth') : undefined

  if (cookieValue !== '1') {
    return navigateTo('/login')
  }
  isAuth.value = true
})
