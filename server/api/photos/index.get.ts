export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { cursor, limit = '30' } = query

  const photos = Array.from({ length: parseInt(limit as string) }, (_, i) => ({
    id: `photo-${cursor || 'start'}-${i}`,
    originalUrl: `https://picsum.photos/seed/api${Date.now()}${i}/1600/1200`,
    webpUrl: `https://picsum.photos/seed/api${Date.now()}${i}/${400 + (i % 3) * 100}/${300 + (i % 4) * 100}`,
    thumbnailUrl: `https://picsum.photos/seed/api${Date.now()}${i}/400/300`,
    width: 1600,
    height: 1200,
    fileSize: 2048000 + i * 100000,
    fileName: `IMG_${2026}${String(i).padStart(4, '0')}.jpg`,
    mimeType: 'image/jpeg',
    takenAt: new Date(2026, 6, 20 - i).toISOString(),
    latitude: (30.5 + i * 0.1).toString(),
    longitude: (120.1 + i * 0.1).toString(),
    cameraMake: 'Apple',
    cameraModel: 'iPhone 15 Pro',
    isVideo: i % 5 === 0,
    videoUrl: i % 5 === 0 ? `https://example.com/videos/${i}.mp4` : null,
    uploadedBy: 'system',
  }))

  return {
    data: photos,
    nextCursor: photos.length === parseInt(limit as string) ? `cursor-${Date.now()}` : null,
  }
})
