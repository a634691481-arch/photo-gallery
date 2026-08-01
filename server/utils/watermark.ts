import sharp from 'sharp'

// Composite a subtle text watermark at the bottom-right corner.
// Font size scales with the image so it stays readable on large originals.
export async function addWatermark(buffer: Buffer, text: string) {
  const meta = await sharp(buffer).metadata()
  const width = meta.width ?? 1200
  const height = meta.height ?? 800
  const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.025))
  const margin = Math.round(fontSize * 0.6)

  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <text x="${width - margin + 1}" y="${height - margin + 1}" text-anchor="end"
    font-family="'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif"
    font-size="${fontSize}" fill="rgba(0,0,0,0.25)">${text}</text>
  <text x="${width - margin}" y="${height - margin}" text-anchor="end"
    font-family="'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif"
    font-size="${fontSize}" fill="rgba(255,255,255,0.5)">${text}</text>
</svg>`)

  return sharp(buffer)
    .composite([{ input: svg }])
    .toBuffer()
}
