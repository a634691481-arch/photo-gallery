<template>
  <canvas ref="canvas" class="fixed inset-0 pointer-events-none" style="z-index: 1" />
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let raf: number
let mx = -1000,
  my = -1000,
  tx = -1000,
  ty = -1000

interface Flash {
  x: number
  y: number
  life: number
  maxLife: number
  r: number
  vx: number
  vy: number
}
let bgParts: { x: number; y: number; vx: number; vy: number; r: number }[] = []
const trailParts: Flash[] = []

const ACCENT = 'rgba(230,168,124,'

function resize() {
  if (!canvas.value) return
  canvas.value.width = innerWidth
  canvas.value.height = innerHeight
}

function init() {
  resize()
  const count = Math.min(50, Math.floor((innerWidth * innerHeight) / 20000))
  bgParts = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.3,
  }))
}

function emitTrail(x: number, y: number) {
  for (let i = 0; i < 2; i++) {
    trailParts.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      r: Math.random() * 1.5 + 0.5,
      life: 1,
      maxLife: 1,
    })
  }
  if (trailParts.length > 60) trailParts.splice(0, trailParts.length - 60)
}

function loop() {
  if (!ctx || !canvas.value) return
  const w = canvas.value.width,
    h = canvas.value.height
  ctx.clearRect(0, 0, w, h)

  tx += (mx - tx) * 0.06
  ty += (my - ty) * 0.06

  if (mx > 0 && my > 0) {
    const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 200)
    g.addColorStop(0, ACCENT + '0.04)')
    g.addColorStop(0.5, ACCENT + '0.01)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  ctx.save()
  ctx.shadowColor = ACCENT + '0.3)'
  ctx.shadowBlur = 24
  ctx.beginPath()
  ctx.arc(tx, ty, 2.5, 0, Math.PI * 2)
  ctx.fillStyle = ACCENT + '0.35)'
  ctx.fill()
  ctx.restore()

  for (const p of bgParts) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
    ctx.save()
    ctx.shadowColor = ACCENT + '0.3)'
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = ACCENT + '0.15)'
    ctx.fill()
    ctx.restore()
  }

  for (let i = trailParts.length - 1; i >= 0; i--) {
    const t = trailParts[i]
    t.life -= 0.025
    if (t.life <= 0) {
      trailParts.splice(i, 1)
      continue
    }
    t.x += t.vx
    t.y += t.vy
    t.vx *= 0.95
    t.vy *= 0.95
    const alpha = t.life * 0.4
    ctx.save()
    ctx.shadowColor = ACCENT + alpha + ')'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2)
    ctx.fillStyle = ACCENT + alpha + ')'
    ctx.fill()
    ctx.restore()
  }

  raf = requestAnimationFrame(loop)
}

function onMouseMove(e: MouseEvent) {
  mx = e.clientX
  my = e.clientY
  emitTrail(mx, my)
}
function onMouseLeave() {
  mx = -1000
  my = -1000
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')!
  init()
  loop()
  addEventListener('resize', resize)
  addEventListener('mousemove', onMouseMove)
  addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  removeEventListener('resize', resize)
  removeEventListener('mousemove', onMouseMove)
  removeEventListener('mouseleave', onMouseLeave)
})
</script>
