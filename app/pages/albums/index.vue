<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我们的相册
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">
          精心挑选的每一个瞬间，每一段故事。
        </p>
      </div>
    </section>
    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-6xl mx-auto">
        <div v-if="pending" class="text-center py-16 text-ink-muted text-sm">加载中...</div>
        <EmptyState
          v-else-if="!albums.length"
          image="/illustrations/the-void.svg"
          alt="暂无相册"
          text="还没有相册，上传照片时可以为它们创建相册"
        >
          <NuxtLink
            to="/upload"
            class="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Icon name="heroicons:cloud-arrow-up" class="size-4" />去上传
          </NuxtLink>
        </EmptyState>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="album in albums"
            :key="album.id"
            class="group relative overflow-hidden rounded-2xl bg-ink-soft/10 aspect-[4/3] cursor-pointer"
            @click="navigateTo(`/albums/${album.id}`)"
          >
            <img
              :src="album.coverUrl"
              :alt="album.title"
              class="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              @error="onImgError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div
              class="absolute bottom-0 left-0 right-0 px-3.5 py-2.5 bg-ink/60 dark:bg-cream/60 backdrop-blur-md border-t border-cream/10 dark:border-ink/20"
            >
              <h3
                class="font-display text-lg sm:text-xl font-medium text-cream dark:text-ink truncate"
              >
                {{ album.title }}
              </h3>
              <p class="text-cream/70 dark:text-ink/70 text-sm mt-0.5">
                {{ album.photoCount }} 张照片
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { data, pending } = useFetch('/api/albums')
const albums = computed(() => data.value ?? [])
const { onImgError } = useImgFallback()
</script>
