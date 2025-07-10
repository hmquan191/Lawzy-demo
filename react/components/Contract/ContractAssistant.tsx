import React, { useState } from 'react'
import ContractUpload from './ContractUpload'
import PDFViewer from './PDFViewer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ContractAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const [extractedText, setExtractedText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  if (!isOpen) return null

  const handleFileProcessed = (text: string, file: File | null) => {
    setExtractedText(text)
    setUploadedFile(file)
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
          <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1'>
            <li>Ví dụ: Mức lương dưới tối thiểu</li>
            <li>Không có điều khoản bảo hiểm</li>
            <li>Thiếu ngày công/giờ làm việc rõ ràng</li>
            <li>Không nêu rõ trách nhiệm pháp lý</li>
          </ul>
        </div>

        {/* Right: Split PDF Viewer and OCR Output */}
        <div className='flex-1 p-4 grid grid-cols-2 gap-4'>
          {/* PDF Viewer Section */}
          <div className='flex flex-col bg-white border rounded shadow-sm max-h-128 min-h-32'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Xem trước PDF</h3>
            <div className='flex-1 overflow-auto'>
              <PDFViewer file={uploadedFile} />
            </div>
          </div>

          {/* OCR Output Section */}
          <div className='flex flex-col bg-white border rounded shadow-sm max-h-128 min-h-32'>
            <h3 className='text-sm font-semibold text-gray-800 p-2 border-b'>Nội dung trích xuất</h3>
            <div className='flex-1 overflow-auto p-2'>
              <pre className='whitespace-pre-wrap text-xs text-gray-800'>
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
