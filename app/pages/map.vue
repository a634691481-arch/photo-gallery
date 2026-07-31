<template>
  <main class="overflow-x-hidden w-full max-w-full">
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我们的足迹
        </h1>
        <p class="mt-4 text-ink-muted text-base max-w-lg mx-auto leading-relaxed">
          我们一起走过的每个地方，都从照片中提取了位置。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-32">
      <div class="max-w-6xl mx-auto">
        <div v-if="pending" class="text-center py-24 text-ink-muted text-sm">加载中...</div>

        <div v-else-if="!locations.length" class="text-center py-24">
          <img
            src="/illustrations/undraw_exploring_d1vd.svg"
            class="w-48 mx-auto mb-4 opacity-70"
          />
          <p class="text-ink-muted text-sm">还没有足迹数据</p>
        </div>

        <template v-else>
          <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-16">
            <div class="text-center">
              <p
                class="font-display font-semibold tracking-tight"
                style="font-size: clamp(2rem, 3vw, 3.5rem)"
              >
                {{ locations.length }}
              </p>
              <p class="text-xs text-ink-muted mt-1">城市</p>
            </div>
            <div class="w-px h-10 bg-ink-soft/10" />
            <div class="text-center">
              <p
                class="font-display font-semibold tracking-tight"
                style="font-size: clamp(2rem, 3vw, 3.5rem)"
              >
                {{ totalPhotos }}
              </p>
              <p class="text-xs text-ink-muted mt-1">照片</p>
            </div>
            <div class="w-px h-10 bg-ink-soft/10" />
            <div class="text-center">
              <p
                class="font-display font-semibold tracking-tight"
                style="font-size: clamp(2rem, 3vw, 3.5rem)"
              >
                {{ topCity }}
              </p>
              <p class="text-xs text-ink-muted mt-1">最常去</p>
            </div>
          </div>

          <div ref="gridRef" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            <div
              v-for="loc in locations"
              :key="loc.name"
              class="map-card"
              :class="[
                'group relative rounded-2xl p-5 sm:p-6 transition-all duration-600 ease-out overflow-hidden cursor-default',
                loc.count >= 60
                  ? 'col-span-2 row-span-1 bg-ink-soft/[0.08] hover:bg-ink-soft/[0.14]'
                  : loc.count >= 30
                    ? 'bg-ink-soft/[0.05] hover:bg-ink-soft/[0.10]'
                    : 'bg-ink-soft/[0.03] hover:bg-ink-soft/[0.07]',
              ]"
            >
              <div
                class="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.03] pointer-events-none"
                :class="loc.count >= 60 ? 'bg-accent translate-x-8 -translate-y-20' : 'bg-ink'"
              />

              <div class="relative z-10">
                <div class="flex items-start justify-between gap-3">
                  <h2
                    class="font-display font-semibold leading-tight tracking-tight"
                    :class="loc.count >= 60 ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'"
                  >
                    {{ loc.name }}
                  </h2>
                  <span
                    class="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                    :class="
                      loc.count >= 60 ? 'bg-accent/15 text-accent' : 'bg-ink-soft/10 text-ink-muted'
                    "
                  >
                    {{ loc.count }} 张
                  </span>
                </div>

                <p class="mt-2 sm:mt-3 text-xs text-ink-muted/50 font-mono tracking-wider">
                  {{ loc.lat.toFixed(2) }}&deg;N &middot; {{ loc.lng.toFixed(2) }}&deg;E
                </p>

                <div v-if="loc.count >= 60" class="mt-4 flex gap-1">
                  <span
                    v-for="n in Math.min(5, Math.ceil(loc.count / 20))"
                    :key="n"
                    class="w-full h-1 rounded-full"
                    :class="n === 1 ? 'bg-accent/60' : 'bg-ink-soft/10'"
                  />
                </div>
              </div>

              <div
                class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink-soft/[0.06] group-hover:ring-accent/25 transition-all duration-600 pointer-events-none"
              />
            </div>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { $gsap } = useNuxtApp()
const { data, pending } = useFetch('/api/map')
const locations = computed(() => (data.value as any[]) ?? [])
const totalPhotos = computed(() => (locations.value as any[]).reduce((s, l) => s + l.count, 0))
const topCity = computed(() => {
  if (!locations.value.length) return '-'
  const top = (locations.value as any[]).reduce((a, b) => (a.count > b.count ? a : b))
  return top.name
})

const gridRef = ref<HTMLElement | null>(null)

onMounted(() => {
  watch(
    () => locations.value.length,
    (len) => {
      if (!len || !gridRef.value) return
      nextTick(() => {
        const cards = gridRef.value!.querySelectorAll('.map-card')
        if (!cards.length) return
        $gsap.fromTo(
          cards,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.value,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    },
    { immediate: true },
  )
})
</script>
