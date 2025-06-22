export const extractMermaidCode = (text: string): string | null => {
  const match = text.match(/```mermaid\s+([\s\S]*?)```/)
  return match ? match[1].trim() : null
}
