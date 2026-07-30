<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-24">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <span class="text-2xl font-display font-semibold tracking-tight">家庭相册</span>
        <p class="mt-3 text-ink-muted text-sm">
          登录查看家庭照片
        </p>
      </div>

      <div class="p-8 rounded-2xl bg-surface dark:bg-ink border border-cream-dark/30 dark:border-ink-soft/10">
        <div class="text-center">
          <div class="w-48 h-48 mx-auto rounded-xl bg-cream-dark/20 dark:bg-ink-soft/10 flex items-center justify-center mb-4">
            <div class="text-center">
              <Icon name="heroicons:qr-code" class="size-16 text-ink-muted/30 block mx-auto" />
              <span class="text-xs text-ink-muted/40 mt-2 block">二维码</span>
            </div>
          </div>
          <p class="text-sm font-medium">微信扫码登录</p>
          <p class="text-xs text-ink-muted mt-1">
            打开微信，扫描二维码登录
          </p>
        </div>

        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-cream-dark/30 dark:bg-ink-soft/10" />
          <span class="text-xs text-ink-muted/40">或</span>
          <div class="flex-1 h-px bg-cream-dark/30 dark:bg-ink-soft/10" />
        </div>

        <p class="text-xs text-center text-ink-muted">
          首次使用？扫码后需管理员通过审核，即可开始使用。
        </p>
      </div>
    </div>
  </div>
</template>
