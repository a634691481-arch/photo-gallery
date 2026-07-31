<template>
  <main class="min-h-screen flex items-center justify-center px-6 overflow-x-hidden">
    <div class="text-center max-w-md">
      <p
        class="font-display text-[10rem] sm:text-[12rem] leading-none font-semibold text-ink-muted/20 select-none"
      >
        404
      </p>
      <h1 class="font-display text-2xl sm:text-3xl font-semibold mt-4 tracking-tight">
        页面不存在
      </h1>
      <p class="mt-3 text-ink-muted text-sm">你寻找的页面可能已被移动或删除。</p>
      <NuxtLink
        to="/"
        class="inline-block mt-8 px-6 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-display font-medium text-sm transition-all duration-500 ease-soft hover:scale-105 active:scale-95 shadow-soft"
      >
        返回首页
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({ title: '页面不存在' })
</script>
