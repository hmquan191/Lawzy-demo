import React from 'react'

interface ChatHeaderProps {
  toggleSidebar: () => void
  sessionId: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleSidebar, sessionId }) => {
  return (
    <div className='p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800'>
      <div className='flex items-center gap-4'>
        <button onClick={toggleSidebar} className='p-1 rounded hover:bg-gray-700'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
        <h1 className='text-lg font-semibold'>Trợ lý Pháp lý AI</h1>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-300'>Phiên ID: {sessionId.substring(0, 8)}</span>
      </div>
    </div>
  )
}

export default ChatHeader 