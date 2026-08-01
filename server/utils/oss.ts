import OSS from 'ali-oss'

let client: OSS | null = null

export function getOSSClient() {
  if (client) return client

  const config = useRuntimeConfig()
  client = new OSS({
    region: config.oss.region,
    accessKeyId: config.oss.accessKeyId,
    accessKeySecret: config.oss.accessKeySecret,
    bucket: config.oss.bucket,
    endpoint: config.oss.endpoint,
  })

  return client
}

export async function uploadToOSS(key: string, buffer: Buffer, mimeType: string) {
  const oss = getOSSClient()
  const result = await oss.put(key, buffer, {
    mime: mimeType,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
  return result.url
}

export function getSignedUrl(key: string) {
  const oss = getOSSClient()
  // Bucket the expiry to the start of the current UTC day so the same key
  // yields the same signed URL within a day: stable URLs let browser and ipx
  // caches hit. expires is relative seconds; the absolute Expires embedded in
  // the signature is dayStart + 365d, which is constant inside a day.
  const dayStartMs = Math.floor(Date.now() / 86_400_000) * 86_400_000
  const expires = Math.round((dayStartMs + 365 * 86_400_000 - Date.now()) / 1000)
  return oss.signatureUrl(key, { expires })
}

export async function deleteFromOSS(key: string) {
  const oss = getOSSClient()
  await oss.delete(key)
}

export function generateOSSKey(prefix: string, fileName: string, date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const ext = fileName.split('.').pop()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}/${year}/${month}/${random}.${ext}`
}
