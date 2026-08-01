export default defineNuxtPlugin(async () => {
  const { magicMouse } = await import('~/assets/vendor/magicmouse.min.js')
  magicMouse({
    outerWidth: 32,
    outerHeight: 32,
    outerStyle: 'circle',
    hoverEffect: 'circle-move',
    hoverItemMove: false,
    defaultCursor: false,
  })

  const cursor = () => document.getElementById('magicMouseCursor')
  const pointer = () => document.getElementById('magicPointer')

  const isEditable = (el: Element) => el.matches('input, textarea, select')

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement
    const interactive = target.closest?.('a, button, [role="button"]')
    const c = cursor()
    const p = pointer()

    if (interactive) {
      if (c) {
        c.style.width = '52px'
        c.style.height = '52px'
        c.style.borderColor = 'rgb(var(--color-accent))'
        c.style.transition = 'width .25s ease, height .25s ease, border-color .25s ease'
      }
      if (p) p.style.background = 'rgb(var(--color-accent))'
    } else if (isEditable(target)) {
      document.body.style.cursor = 'auto'
      if (c) c.style.opacity = '0'
      if (p) p.style.opacity = '0'
    } else {
      if (c) {
        c.style.width = '32px'
        c.style.height = '32px'
        c.style.borderColor = '#fff'
      }
      if (p) p.style.background = '#fff'
    }
  })

  document.addEventListener('mouseout', () => {
    document.body.style.cursor = ''
  })
})
