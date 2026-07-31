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

export function getSignedUrl(key: string, expires = 3600 * 24 * 365) {
  const oss = getOSSClient()
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
