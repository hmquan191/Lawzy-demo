import React, { useState } from 'react'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker to local static file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface Props {
  onTextExtracted: (text: string) => void
}

const ContractUpload: React.FC<Props> = ({ onTextExtracted }) => {
  const [loading, setLoading] = useState(false)

  // Convert PDF page to image
  async function* convertPDFToImages(file: File) {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise
    const numPages = pdf.numPages

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 }) // Higher scale for better OCR
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) continue

      canvas.height = viewport.height
      canvas.width = viewport.width
      await page.render({ canvasContext: context, viewport }).promise
      const imgData = canvas.toDataURL('image/png')
      yield { image: imgData, pageNum: i }
    }
  }

  // Perform OCR on a single image
  async function performOCR(image: string): Promise<string> {
    const worker = await Tesseract.createWorker('vie')
    try {
      const {
        data: { text }
      } = await worker.recognize(image)
      return text
    } finally {
      await worker.terminate()
    }
  }

  // Process PDF file
  async function processPDF(file: File) {
    const imageIterator = convertPDFToImages(file)
    let extractedText = ''
    for await (const { image, pageNum } of imageIterator) {
      const text = await performOCR(image)
      extractedText += `--- Trang ${pageNum} ---\n${text}\n`
    }
    return extractedText
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      if (file.type === 'application/pdf') {
        const text = await processPDF(file)
        onTextExtracted(text)
      } else if (file.type.startsWith('image/')) {
        const buffer = await file.arrayBuffer()
        const blob = new Blob([buffer], { type: file.type })
        const imageUrl = URL.createObjectURL(blob)
        const { data } = await Tesseract.recognize(imageUrl, 'vie', {
          logger: (m) => console.log(m)
        })
        onTextExtracted(data.text)
        URL.revokeObjectURL(imageUrl)
      } else {
        onTextExtracted('Định dạng file không được hỗ trợ. Vui lòng tải lên PDF hoặc hình ảnh.')
      }
    } catch (err) {
      console.error('❌ Lỗi OCR:', err)
      onTextExtracted('Không thể đọc được nội dung.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        type='file'
        accept='image/*,application/pdf'
        onChange={handleFileChange}
        className='text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
      />
      {loading && <span className='text-orange-500 text-sm'>Đang xử lý...</span>}
    </div>
  )
}

export default ContractUpload
