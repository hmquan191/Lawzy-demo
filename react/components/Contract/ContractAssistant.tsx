import React, { useState } from 'react'
import ContractUpload from './ContractUpload'
import PDFViewer from './PDFViewer'
import { useDispatch } from 'react-redux'
import { setExtractedTextRedux } from '../../store/slices/extractedSlice' // 👈 dùng tên mới

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
    console.log('📝 OCR Text:', text)
    setExtractedText(text) // tôi cũng muốn nó in ra trong mục nội dung trích xuất extractedText bên dưới phần return nữa chứ
    dispatch(setExtractedTextRedux(text))
    setUploadedFile(file)

    try {
      const res = await fetch('https://lawzy-backend.onrender.com/api/chatbot', {
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
      console.log('📌 Kết quả phân tích hợp đồng:', data)

      if (data?.suggestions && Array.isArray(data.suggestions)) {
        setWarnings(data.suggestions)
      } else {
        console.warn('⚠️ Phản hồi không chứa "suggestions" hợp lệ:', data)
      }
    } catch (err) {
      console.error('❌ Lỗi gửi OCR tới chatbot:', err)
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
        {/* Left: Compact Notes Section */}
        <div className='w-1/4 border-r p-4 overflow-auto bg-white shadow-sm'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>📝 Các mục cần lưu ý</h3>
          {warnings.length > 0 ? (
            <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1'>
              {warnings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 text-sm'>Chưa có cảnh báo nào, vui lòng tải hợp đồng.</p>
          )}
        </div>

        {/* Right: Split PDF Viewer and OCR Output */}
        <div className='flex-1 p-4 grid grid-cols-2 gap-4'>
          {/* PDF Viewer Section */}
          <div className='flex flex-col bg-white border rounded shadow-sm h-full min-h-32'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Xem trước PDF</h3>
            <div className='flex-1 overflow-auto'>
              <PDFViewer file={uploadedFile} />
            </div>
          </div>

          {/* OCR Output Section */}
          <div className='flex flex-col bg-white border rounded shadow-sm h-full min-h-32'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Nội dung trích xuất</h3>
            <div className='flex-1 overflow-auto p-2'>
              <pre className='font-sans text-sm'>{extractedText || 'Vui lòng tải lên hợp đồng để xem nội dung.'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractAssistant
