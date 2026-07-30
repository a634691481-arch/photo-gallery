// POST /api/faces/detect - Save face detection results from client
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { photoId, faces } = body

  if (!photoId || !faces) {
    throw createError({ statusCode: 400, message: 'Missing photoId or faces' })
  }

  // faces: Array<{ descriptor: number[], x: number, y: number, width: number, height: number }>
  // TODO: Store face descriptors in database
  // TODO: Match against existing face labels using Euclidean distance
  // TODO: Auto-assign to known people if match found

  return {
    success: true,
    matched: faces.map((f: any) => ({
      ...f,
      matchedLabel: null, // or matched person name if auto-matched
      matchedLabelId: null,
    })),
  }
})
