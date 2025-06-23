import React from 'react'

interface ChatHeaderProps {
  toggleSidebar: () => void
  sessionId: string
  showLawyers: boolean
  toggleLawyersPanel: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleSidebar, sessionId, toggleLawyersPanel }) => {
  return (
    <div className='p-4 border-b border-gray-200 flex items-center justify-between bg-[#fefff9] text-gray-800 flex-shrink-0 font-["Product_Sans"]'>
      <div className='flex items-center gap-4'>
        <button onClick={toggleSidebar} className='p-1 rounded hover:bg-[#fc8e5a]/10'>
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
        
        <span className='text-sm bg-[#fc8e5a] px-3 py-1.5 rounded text-white'>Trợ lý pháp lý AI</span>
        
        <button 
          onClick={toggleLawyersPanel}
          className='px-3 py-1.5 bg-[#fc8e5a] text-white hover:bg-[#fc8e5a]/90 rounded-md flex items-center gap-2 text-sm'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
          Kết nối luật sư
        </button>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm bg-[#fc8e5a] px-3 py-1.5 rounded text-white'>Xin chào, Nguyễn Văn A</span>
        <span className='text-sm bg-[#fc8e5a]/10 text-[#fc8e5a] px-2 py-1 rounded'>ID: {sessionId.substring(0, 8)}</span>
      </div>
    </div>
  )
}

export default ChatHeader 