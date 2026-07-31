<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="font-display text-2xl sm:text-3xl font-semibold">管理后台</h1>
            <p class="text-ink-muted text-sm mt-1">管理家庭相册</p>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div class="p-4 rounded-xl bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">{{ stats?.photos ?? '-' }}</p>
            <p class="text-xs text-ink-muted mt-1">总照片数</p>
          </div>
          <div class="p-4 rounded-xl bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">{{ stats?.albums ?? '-' }}</p>
            <p class="text-xs text-ink-muted mt-1">相册数</p>
          </div>
          <div class="p-4 rounded-xl bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">{{ stats?.members ?? '-' }}</p>
            <p class="text-xs text-ink-muted mt-1">成员</p>
          </div>
          <div class="p-4 rounded-xl bg-ink-soft/10">
            <p class="text-2xl font-display font-semibold">{{ stats?.pending ?? 0 }}</p>
            <p class="text-xs text-ink-muted mt-1">待审核</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { data } = useFetch('/api/admin/stats')
const stats = computed(() => data.value)
</script>
