import { getSignedUrl } from './oss'

// Map a DB row (snake_case columns) to camelCase API shape, signing URLs.
// DB stores OSS keys (e.g. "photos/2026/07/abc.jpg"); buckets are private,
// so every read signs the URL on the fly (1-year expiry).
// External URLs (seed data) and local paths pass through unchanged.
export function withPhotoUrls<T extends Record<string, any>>(row: T) {
  const sign = (key: string | null | undefined) => {
    if (!key) return null
    if (/^https?:\/\//.test(key)) return key
    if (key.startsWith('/')) return key
    return getSignedUrl(key)
  }

  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(row)) {
    out[k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())] = v
  }

  out.originalUrl = sign(row.original_url ?? row.originalUrl)
  out.webpUrl = sign(row.webp_url ?? row.webpUrl)
  out.thumbnailUrl = sign(row.thumbnail_url ?? row.thumbnailUrl)
  out.videoUrl = sign(row.video_url ?? row.videoUrl)
  out.videoCover = sign(row.video_cover ?? row.videoCover)
  out.coverUrl = sign(row.cover_url ?? row.coverUrl)

  return out as T & {
    originalUrl: string | null
    webpUrl: string | null
    thumbnailUrl: string | null
    videoUrl: string | null
    videoCover: string | null
    coverUrl: string | null
  }
}
