// GET /api/albums - List albums
export default defineEventHandler(async () => {
  // TODO: Query albums from database
  const albums = [
    { id: '1', title: 'Summer Vacation 2026', description: 'Beach and sun', coverUrl: 'https://picsum.photos/seed/alb1/800/600', photoCount: 42, createdBy: 'user-1', createdAt: '2026-07-01' },
    { id: '2', title: 'Baby First Steps', description: 'Emma learning to walk', coverUrl: 'https://picsum.photos/seed/alb2/800/600', photoCount: 18, createdBy: 'user-1', createdAt: '2026-06-15' },
    { id: '3', title: 'Spring Festival', description: null, coverUrl: 'https://picsum.photos/seed/alb3/800/600', photoCount: 56, createdBy: 'user-2', createdAt: '2026-02-10' },
  ]

  return { data: albums }
})
