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
            <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h3 class="font-display text-lg sm:text-xl font-medium text-ink">
                {{ album.title }}
              </h3>
              <p class="text-cream/50 text-sm mt-1">{{ album.photoCount }} 张照片</p>
            </div>
          </div>
          <NuxtLink
            to="/albums/create"
            class="flex items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-ink-soft/20 hover:border-cream transition-colors group"
          >
            <div class="text-center">
              <Icon
                name="heroicons:plus-circle"
                class="size-10 block mx-auto mb-2 text-ink-muted/40 group-hover:text-cream transition-colors"
              /><span class="text-sm text-ink-muted">新建相册</span>
            </div>
          </NuxtLink>
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
