export function useBodyLock(active: Ref<boolean>) {
  let previous = ''

  watch(
    active,
    (v) => {
      if (!import.meta.client) return
      if (v) {
        previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = previous || ''
      }
    },
    { immediate: true },
  )
}
