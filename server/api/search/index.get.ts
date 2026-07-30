// GET /api/search - AI natural language search
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { q } = query

  if (!q || typeof q !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing search query' })
  }

  // TODO: Generate text embedding for the query
  // TODO: Search pgvector for similar photo embeddings (cosine similarity)
  // TODO: Return matched photos ordered by similarity score

  // Placeholder
  const results = Array.from({ length: 12 }, (_, i) => ({
    id: `search-${i}`,
    webpUrl: `https://picsum.photos/seed/searchr${i}/${400}/${400}`,
    thumbnailUrl: `https://picsum.photos/seed/searchr${i}/200/200`,
    similarity: (0.95 - i * 0.05).toFixed(4),
    takenAt: new Date(2026, 6, 20 - i).toISOString(),
  }))

  return {
    query: q,
    results,
    took: '120ms',
  }
})
