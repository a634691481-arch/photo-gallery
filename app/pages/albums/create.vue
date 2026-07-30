<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-2xl mx-auto">
        <h1 class="font-display text-2xl sm:text-3xl font-semibold mb-8">新建相册</h1>
        <form @submit.prevent="handleCreate" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2 text-ink">相册标题</label>
            <input
              v-model="title"
              type="text"
              required
              placeholder="例如：2026 暑假旅行"
              class="w-full px-4 py-3 rounded-xl border border-ink-soft/10 bg-transparent text-ink focus:outline-none focus:border-accent text-sm transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-ink">描述（可选）</label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="这个相册是关于什么的？"
              class="w-full px-4 py-3 rounded-xl border border-ink-soft/10 bg-transparent text-ink focus:outline-none focus:border-accent text-sm transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            class="px-8 py-3 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-display font-medium text-sm transition-all duration-300 hover:scale-105"
          >
            创建相册
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const title = ref('')
const description = ref('')
const handleCreate = async () => {
  await navigateTo('/albums')
}
</script>
