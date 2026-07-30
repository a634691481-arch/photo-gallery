<template>
  <div>
    <section class="pt-24 sm:pt-32 md:pt-40 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="font-display font-semibold leading-[1.05] tracking-tight text-ink [text-wrap:balance]"
          style="font-size: clamp(2.5rem, 5vw, 4.5rem);">
          我们的家人
        </h1>
        <p class="mt-3 text-ink-muted text-base max-w-lg mx-auto">
          让家庭完整的那些面孔，每一个都值得被记住。
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-24">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
          <div
            v-for="person in people"
            :key="person.id"
            class="group text-center cursor-pointer"
            @click="navigateTo(`/people/${person.id}`)"
          >
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden ring-2 ring-cream-dark/30 dark:ring-ink-soft/10 transition-all duration-500 group-hover:ring-accent group-hover:scale-105">
              <img :src="person.avatar" class="w-full h-full object-cover" />
            </div>
            <p class="mt-3 font-display text-sm font-medium">{{ person.name }}</p>
            <p class="text-xs text-ink-muted">{{ person.count }} 张照片</p>
          </div>

          <div class="text-center group cursor-pointer">
            <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-2 border-dashed border-cream-dark/40 dark:border-ink-soft/20 flex items-center justify-center transition-all duration-300 group-hover:border-ink dark:group-hover:border-cream">
              <Icon name="heroicons:plus" class="size-6 text-ink-muted/40" />
            </div>
            <p class="mt-3 text-sm text-ink-muted">添加人物</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const people = [
  { id: '1', name: '宝宝 Emma', avatar: 'https://picsum.photos/seed/face1/200/200', count: 245 },
  { id: '2', name: '妈妈', avatar: 'https://picsum.photos/seed/face2/200/200', count: 89 },
  { id: '3', name: '爸爸', avatar: 'https://picsum.photos/seed/face3/200/200', count: 67 },
  { id: '4', name: '奶奶', avatar: 'https://picsum.photos/seed/face4/200/200', count: 34 },
]
</script>
