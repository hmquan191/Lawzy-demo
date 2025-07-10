import React, { useState } from 'react'
import ContractUpload from './ContractUpload'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ContractAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const [extractedText, setExtractedText] = useState('')

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 font-sans  border-gray-200 bg-[#fefff9] h-full flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b flex justify-between items-center bg-[#fefff9]'>
        <h1 className='text-2xl font-semibold text-gray-800'>Trợ lý hợp đồng</h1>
        <button onClick={onClose} className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm'>
          Quay lại
        </button>
      </div>

      {/* Body */}
      <div className='flex flex-1'>
        {/* Bên trái: Danh sách mục lưu ý */}
        <div className='w-1/3 border-r p-4 overflow-auto'>
          <h3 className=' text-xl font-semibold text-gray-800 mb-2'>📝 Các mục cần lưu ý</h3>
          <ul className='list-disc pl-5 text-sm text-gray-700 space-y-1'>
            <li>Ví dụ: Mức lương dưới tối thiểu</li>
            <li>Không có điều khoản bảo hiểm</li>
            <li>Thiếu ngày công/giờ làm việc rõ ràng</li>
            <li>Không nêu rõ trách nhiệm pháp lý</li>
          </ul>
        </div>

        {/* Bên phải: Upload và hiển thị OCR */}
        <div className='flex-1 p-4 overflow-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className=' text-xl font-semibold text-gray-800 mb-2'>📄 Nội dung hợp đồng</h3>
            <ContractUpload onTextExtracted={setExtractedText} />
          </div>
          <pre className='whitespace-pre-wrap text-sm text-gray-800 border p-3 bg-gray-50 rounded max-h-[80vh] overflow-auto'>
            {extractedText || 'Vui lòng tải lên hợp đồng để xem nội dung.'}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ContractAssistant
