# photo-gallery

Private family photo gallery. Nuxt 4 + Ali OSS + Supabase.

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
pnpm format       # prettier write
pnpm format:check # prettier check

```

## Stack

- **Nuxt 4.5.1** with `app/` directory structure (not root-level pages/server)
- **Node 22** (see `.nvmrc`)
- **pnpm** (lockfile: `pnpm-lock.yaml`)
- **Tailwind CSS** via `@nuxtjs/tailwindcss` — config at `tailwind.config.ts`
- **@nuxt/icon** with iconify provider, mode: css
- **GSAP** for scroll/entrance animations
- **PhotoSwipe** for lightbox
- **Sharp** + **heic-convert** for image processing
- **Ali OSS** for photo storage

## Conventions

- **Icons:** ALL icons must use heroicons from https://heroicons.com. Format: `<Icon name="heroicons:xxx" />`. Never use `ph-` (phosphor) or any other icon set.
- **Formatting:** No semicolons, single quotes, trailing commas. See `.prettierrc`.
- **Colors:** CSS variables in `app/assets/css/main.css`. Use Tailwind classes (`bg-cream`, `text-ink`, `text-accent`) not raw hex.
- **Design system:** See `DESIGN.md` for full specs. Key rules:
  - Terracotta accent on <5% of screen only
  - Rounded-full for interactive surfaces, rounded-2xl/rounded-xl for containers
  - Tonal differentiation over shadows/borders
  - `font-display` for headings, `font-body` for prose
- **Auth:** Simple password cookie (`family_auth`). Middleware at `app/middleware/auth.ts`. Pages use `definePageMeta({ middleware: 'auth' })`.
- **Layouts:** `default.vue` (with nav/footer) and `blank.vue` (minimal).

## Structure

```
app/
  pages/        # routes (index, login, upload, albums/, people/, search, etc.)
  components/   # Vue components
  composables/  # useAuth, usePhotoSwipe, useToast, useUpload
  layouts/      # default, blank
  middleware/   # auth
  plugins/      # client-only plugins
  assets/css/   # main.css (Tailwind + CSS vars)
server/
  api/          # API routes (albums/, auth/, faces/, photos/, search/, upload/)
  middleware/   # server middleware
  utils/        # server utilities

```

## Gotchas

- Ali OSS credentials via env vars (see `.env.example`)
- GSAP plugin is client-only (`plugins/gsap.client.ts`)
- Nuxt 4 compat date: `2026-07-30`
