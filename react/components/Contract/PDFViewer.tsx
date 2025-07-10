import React, { useState, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker to local static file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface Props {
  file: File | null
}

const PDFViewer: React.FC<Props> = ({ file }) => {
  const [pdfPages, setPdfPages] = useState<string[]>([])
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!file || file.type !== 'application/pdf') {
      setPdfPages([])
      return
    }

    const renderPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise
        const numPages = pdf.numPages
        const pages: string[] = []

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: zoom })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) continue

          const outputScale = window.devicePixelRatio || 1
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          context.scale(outputScale, outputScale)

          await page.render({ canvasContext: context, viewport }).promise
          pages.push(canvas.toDataURL('image/png', 1.0))
        }

        setPdfPages(pages)
      } catch (err) {
        console.error('❌ Lỗi hiển thị PDF:', err)
        setPdfPages([])
      }
    }

    renderPDF()
  }, [file, zoom]) // 👈 Zoom thay đổi thì render lại

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))

  if (pdfPages.length === 0) {
    return (
      <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
        Vui lòng tải lên file PDF để xem.
      </div>
    )
  }


return (
  <div className="relative flex flex-col h-full w-full">
    {/* Zoom Controls */}
    <div className="sticky top-0 z-10 bg-white p-2 flex justify-end gap-3 shadow">
      <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-100">
        <img src="assets/zoom-out.svg" alt="Zoom out" className="w-5 h-5" />
      </button>
      <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-100">
        <img src="assets/zoom-in.svg" alt="Zoom in" className="w-5 h-5" />
      </button>
    </div>

    {/* Render PDF pages */}
    <div className="flex-1 overflow-auto p-2 gap-4 flex flex-col">
      {pdfPages.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`PDF page ${idx + 1}`}
          className="max-w-[1200px] w-full h-auto border shadow-sm mx-auto"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        />
      ))}
    </div>
  </div>
)

}

export default PDFViewer
