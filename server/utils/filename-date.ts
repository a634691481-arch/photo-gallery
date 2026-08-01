// Try to extract a capture datetime from common filename patterns when EXIF
// has no DateTimeOriginal (e.g. photos exported from QQ zones, WeChat, etc.).
// Returns "YYYY-MM-DD HH:mm:ss" or null.
export function dateFromFileName(fileName: string): string | null {
  const name = fileName.replace(/\.[^.]+$/, '').trim()

  // 20250824_104921 / 20250824-104921 / 20250824 104921 (no separator or _-/)
  const compact = name.match(/(\d{4})(\d{2})(\d{2})[-_ ]?(\d{2})[-_.]?(\d{2})[-_.]?(\d{2})/)
  if (compact) {
    const [_, y, mo, d, h, mi, s] = compact
    if (isValidDate(y, mo, d, h, mi, s)) return `${y}-${mo}-${d} ${h}:${mi}:${s}`
  }

  // 2025-08-24_10-49-21 / 2025-08-24 104921 / 2025.08.24 10.49.21
  const dashed = name.match(/(\d{4})[-.](\d{2})[-.](\d{2})[-_ ](\d{2})[-.:]?(\d{2})[-.:]?(\d{2})/)
  if (dashed) {
    const [_, y, mo, d, h, mi, s] = dashed
    if (isValidDate(y, mo, d, h, mi, s)) return `${y}-${mo}-${d} ${h}:${mi}:${s}`
  }

  // 20250824_104921 fallback: date-only patterns like 20250824 / 2025-08-24
  const dateOnly = name.match(/(\d{4})[-_]?(\d{2})[-_]?(\d{2})(?!\d)/)
  if (dateOnly) {
    const [_, y, mo, d] = dateOnly
    if (isValidDate(y, mo, d, '00', '00', '00')) return `${y}-${mo}-${d} 00:00:00`
  }

  return null
}

function isValidDate(y: string, mo: string, d: string, h: string, mi: string, s: string): boolean {
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s))
  return (
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(mo) - 1 &&
    date.getDate() === Number(d) &&
    date.getHours() === Number(h) &&
    date.getMinutes() === Number(mi) &&
    date.getSeconds() === Number(s)
  )
}
