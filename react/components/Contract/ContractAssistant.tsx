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
          message: '[PHÂN TÍCH HỢP ĐỒNG]',
          context: text,
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
      <div className='p-4 border-b bg-[#fefff9] flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-800'>Trợ lý hợp đồng</h1>
        <div className='flex items-center gap-4'>
          <ContractUpload onFileProcessed={handleFileProcessed} />
          <button onClick={onClose} className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm'>
            Quay lại
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left: Warnings */}
        <div className='w-1/4 border-r p-4 overflow-auto bg-white shadow-sm'>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>📝 Các mục cần lưu ý</h3>

          {warnings.length > 0 ? (
            <ul className='space-y-2'>
              {warnings.map((item, idx) => (
                <li
                  key={idx}
                  className='text-base text-gray-800 px-3 py-2 rounded-lg bg-gray-50 hover:bg-yellow-100 transition-all duration-200 cursor-pointer shadow-sm'
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 text-sm'>Chưa có cảnh báo nào, vui lòng tải hợp đồng.</p>
          )}
        </div>

        {/* Right: PDF Viewer & OCR Output */}
        <div className='flex-1 p-4 grid grid-cols-2 gap-4'>
          {/* PDF Viewer */}
          <div className='flex flex-col bg-white border rounded shadow-sm h-full'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Xem trước PDF</h3>
            <div className='flex-1 overflow-auto'>
              <PDFViewer file={uploadedFile} />
            </div>
          </div>

          {/* OCR Output */}
          <div className='flex flex-col bg-white border rounded shadow-sm h-full'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Nội dung trích xuất</h3>
            <div className='flex-1 overflow-auto p-2'>
              <pre className='font-sans text-sm whitespace-pre-wrap'>
                {extractedText || 'Vui lòng tải lên hợp đồng để xem nội dung.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractAssistant
