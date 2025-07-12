import React, { useState } from 'react'
import ContractUpload from './ContractUpload'
import PDFViewer from './PDFViewer'
import { useDispatch } from 'react-redux'
import { setExtractedTextRedux } from '../../store/slices/extractedSlice'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ContractAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()

  const [extractedText, setExtractedText] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  if (!isOpen) return null

  const handleFileProcessed = async (text: string, file: File | null) => {
    setExtractedText(text)
    setUploadedFile(file)
    dispatch(setExtractedTextRedux(text))
    console.log('📝 OCR Text:', text)

    try {
      const res = await fetch('https://platform.phoai.vn/webhook/chatbotContract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: 'contract-analysis'
        })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      console.log('📌 Phản hồi từ chatbot:', data)

      // Xử lý 2 trường hợp: phản hồi trực tiếp hoặc được gói trong chuỗi JSON
      let parsed = data
      if (typeof data.output === 'string') {
        try {
          parsed = JSON.parse(data.output)
        } catch (err) {
          console.error('❌ Không thể parse output:', err)
        }
      }

      if (parsed?.suggestions && Array.isArray(parsed.suggestions)) {
        setWarnings(parsed.suggestions)
      } else {
        console.warn('⚠️ Phản hồi không có "suggestions" hợp lệ:', parsed)
      }
    } catch (err) {
      console.error('❌ Lỗi gửi dữ liệu tới chatbot:', err)
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-[#fefff9] font-sans flex flex-col h-full'>
      {/* Header */}
      <div className='p-4 border-b bg-white flex justify-between items-center shadow-sm'>
        <h1 className='text-2xl font-bold text-gray-900'>📘 Trợ lý hợp đồng – Lawzy</h1>
        <div className='flex items-center gap-3'>
          <ContractUpload onFileProcessed={handleFileProcessed} />
          <button
            onClick={onClose}
            className='bg-red-600 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 transition-all'
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left: Warnings */}
        <div className='w-1/4 border-r p-4 overflow-auto bg-gray-50 shadow-inner'>
          <h3 className='text-xl font-semibold text-gray-900 mb-4'>🛡️ Các mục cần lưu ý</h3>

          {warnings.length > 0 ? (
            <ul className='space-y-3'>
              {warnings.map((item, idx) => (
                <li
                  key={idx}
                  className='bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer'
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 text-sm'>📄 Vui lòng tải hợp đồng để được phân tích và gợi ý.</p>
          )}
        </div>

        {/* Right: PDF Viewer & OCR Output */}
        <div className='flex-1 p-6 grid grid-cols-2 gap-6 bg-gray-50'>
          {/* PDF Viewer */}
          <div className='flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
            <div className='px-4 py-2 border-b border-gray-100 bg-gray-100'>
              <h3 className='text-sm font-semibold text-gray-700'>📄 Xem trước PDF</h3>
            </div>
            <div className='flex-1 overflow-auto'>
              <PDFViewer file={uploadedFile} />
            </div>
          </div>

          {/* OCR Output */}
          <div className='flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
            <div className='px-4 py-2 border-b border-gray-100 bg-gray-100'>
              <h3 className='text-sm font-semibold text-gray-700'>🔎 Nội dung trích xuất</h3>
            </div>
            <div className='flex-1 overflow-auto p-4 bg-white text-sm text-gray-800 whitespace-pre-wrap font-mono'>
              {extractedText || '⏳ Vui lòng tải hợp đồng để xem nội dung.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractAssistant
