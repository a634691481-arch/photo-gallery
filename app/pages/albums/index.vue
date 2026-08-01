<template>
  <div>
    <section class="pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <span
          class="inline-block px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-ink-soft/5 ring-1 ring-ink-soft/10 text-ink-muted mb-6"
        >
          相册集
        </span>
        <h1
          class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem)"
        >
          我们的相册
        </h1>
        <p class="mt-5 text-ink-muted text-base max-w-lg mx-auto leading-relaxed">
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
          text="还没有相册，为你的美好瞬间创建一个吧"
        >
          <button
            class="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink text-sm font-medium transition-all duration-500 ease-soft hover:scale-105 active:scale-95"
            @click="showCreate = true"
          >
            <Icon name="heroicons:plus" class="size-4" />去创建
          </button>
        </EmptyState>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="album in albums"
            :key="album.id"
            class="group relative p-1.5 rounded-[1.375rem] bg-cream-dark/60 dark:bg-ink-soft/10 ring-1 ring-ink-soft/5 shadow-soft transition-all duration-500 ease-soft hover:shadow-soft-lg cursor-pointer"
            @click="navigateTo(`/albums/${album.id}`)"
          >
            <div class="relative overflow-hidden rounded-[1.125rem] aspect-[4/3]">
              <NuxtImg
                :src="album.coverUrl"
                :alt="album.title"
                class="w-full h-full object-cover transition-all duration-700 ease-soft group-hover:scale-105"
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                @error="onImgError"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent opacity-80 transition-opacity duration-500 ease-soft group-hover:opacity-100"
              />
              <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 class="font-display text-lg sm:text-xl font-medium text-cream truncate">
                  {{ album.title }}
                </h3>
                <p class="text-cream/70 text-sm mt-0.5">{{ album.photoCount }} 张照片</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AlbumCreateDialog v-model:visible="showCreate" @created="refresh" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: '相册' })
const { data, pending, refresh } = useFetch('/api/albums')
const albums = computed(() => data.value ?? [])
const { onImgError } = useImgFallback()

const showCreate = ref(false)
</script>
