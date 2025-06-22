/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractDiagramJson = (
  raw: string
): {
  cleanText: string
  diagram: any | null
} => {
  let diagram: any | null = null
  let cleanText = raw.trim()

  // 1. Tìm toàn bộ JSON object (dài nhất có thể)
  const fullJsonMatch = raw.match(/\{[\s\S]*"diagram"[\s\S]*?\}/)

  if (fullJsonMatch) {
    const matchedText = fullJsonMatch[0]

    try {
      const fullObj = JSON.parse(matchedText)

      if ('diagram' in fullObj && fullObj.diagram?.nodes && fullObj.diagram?.edges) {
        diagram = fullObj.diagram
      } else if (fullObj?.nodes && fullObj?.edges) {
        diagram = fullObj
      }

      cleanText = raw.replace(matchedText, '').trim()
    } catch (err) {
      console.warn('⚠️ Không thể parse JSON sơ đồ:', err)
    }
  }

  return { cleanText, diagram }
}
