/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// ✅ Fix worker cho Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface Props {
  onTextExtracted: (text: string) => void
}

const ContractUpload: React.FC<Props> = ({ onTextExtracted }) => {
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      if (file.type === 'application/pdf') {
        const buffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
        const allText: string[] = []

        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          allText.push(strings.join(' '))
        }

        onTextExtracted(allText.join('\n'))
      } else {
        const buffer = await file.arrayBuffer()
        const blob = new Blob([buffer], { type: file.type })
        const imageUrl = URL.createObjectURL(blob)
        const { data } = await Tesseract.recognize(imageUrl, 'vie', {
          logger: (m) => console.log(m)
        })
        onTextExtracted(data.text)
        URL.revokeObjectURL(imageUrl)
      }
    } catch (err) {
      console.error('❌ Lỗi OCR:', err)
      onTextExtracted('Không thể đọc được nội dung.')
    }
    setLoading(false)
  }

  return (
    <div className='flex items-center gap-2'>
      <input type='file' accept='image/*,application/pdf' onChange={handleFileChange} className='text-sm' />
      {loading && <span className='text-orange-500 text-sm'>Đang xử lý...</span>}
    </div>
  )
}

export default ContractUpload
