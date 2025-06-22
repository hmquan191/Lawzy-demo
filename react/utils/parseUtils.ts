import type { DiagramData } from '../types'

interface ExtractResult {
  text: string
  diagram: DiagramData | null
}

export const extractDiagramJson = (raw: string): ExtractResult => {
  let cleanText = raw
  let diagram: DiagramData | null = null

  try {
    // Nếu entire string là JSON (object), parse luôn
    const parsed = JSON.parse(raw)
    if (parsed.diagram) {
      return { text: parsed.output || '', diagram: parsed.diagram }
    }
  } catch {
    // Không làm gì vì có thể là text thường
  }

  // ✅ Nếu không phải object JSON, cố tìm đoạn JSON nhúng bên trong văn bản
  const match = raw.match(/\{[\s\S]*?"diagram"\s*:\s*\{[\s\S]*?\}\s*\}/)

  if (match) {
    try {
      const diagramObj = JSON.parse(match[0])
      diagram = diagramObj.diagram || null
      cleanText = raw.replace(match[0], '').trim()
    } catch (err) {
      console.warn('❌ Không thể parse JSON sơ đồ:', err)
    }
  }

  return { text: cleanText.trim(), diagram }
}
