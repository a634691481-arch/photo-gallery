export function useImgFallback() {
  const onImgError = (e: Event) => {
    const img = e.target as HTMLImageElement
    if (img.dataset.fallback) return
    img.dataset.fallback = '1'
    img.style.background = '#25201b'
    img.style.minHeight = '200px'
    img.src = ''
  }
  return { onImgError }
}
