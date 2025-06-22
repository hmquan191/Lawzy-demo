import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface DiagramSectionProps {
  mermaidCode: string | null
}

const DiagramSection: React.FC<DiagramSectionProps> = ({ mermaidCode }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mermaidCode || !containerRef.current) return

    try {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })

      mermaid.render('mermaid-diagram', mermaidCode).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
    } catch (error) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p class="text-red-400">⚠️ Lỗi khi vẽ sơ đồ Mermaid.</p>'
        console.error('Mermaid render error:', error)
      }
    }
  }, [mermaidCode])

  if (!mermaidCode) return null

  return (
    <div className='w-[420px] max-w-[100%] h-full p-4 border-l border-gray-700 bg-gray-950 overflow-auto'>
      <h2 className='text-lg font-semibold text-white mb-3'>📊 Sơ đồ minh họa</h2>
      <div ref={containerRef} className='overflow-x-auto max-h-full' />
    </div>
  )
}

export default DiagramSection
