import React from 'react'
import type { ChatHistory } from '../types'

interface ChatSidebarProps {
  sidebarOpen: boolean
  chatHistories: ChatHistory[]
  activeChatId: string | null
  startNewChat: () => void
  setActiveChatId: (id: string) => void
  formatDate: (date: Date) => string
  className?: string
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sidebarOpen,
  chatHistories,
  activeChatId,
  startNewChat,
  setActiveChatId,
  formatDate,
  className
}) => {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-72' : 'w-0'
      } transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-200 bg-[#fefff9] h-full font-['Product_Sans'] ${
        className || ''
      }`}
    >
      {/* Logo and New Chat Button */}
      <div className='p-4 flex flex-col gap-4 items-center'>
        <div className='flex items-center justify-center min-w-min mb-2 -mt-7'>
          <img className='max-w-[160px] h-auto object-contain' src='assets/LawzyLogo.png' alt='Lawzy Logo' />
        </div>
        <button
          onClick={startNewChat}
          className='w-full py-2 px-4 bg-[#fc8e5a] text-white hover:bg-[#fc8e5a]/90 rounded-md flex items-center gap-2 justify-center text-base font-medium'
        >
          <h1 className='text-base font-sans text-center'>New Chat</h1>
        </button>
      </div>

      {/* Chat History */}
      <div className='p-2 border-b border-gray-200'>
        <h3 className='text-xs font-sans text-gray-400 mb-2 px-2 tracking-wide uppercase'>Lịch sử hội thoại</h3>
        <div className='space-y-1'>
          {chatHistories.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 font-sans rounded cursor-pointer hover:bg-gray-100 ${
                activeChatId === chat.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <div className='text-sm text-gray-800 truncate'>{chat.title}</div>
              <div className='text-xs text-gray-400'>{formatDate(chat.date)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-1 p-4 font-sans'>
        <div className='relative group w-fit'>
          <h3 className='text-lg mb-2 text-gray-800 cursor-pointer font-semibold'>
            Explore Lawzy{' '}
            <span className='italic text-xs text-gray-500 flex justify-center items-center w-full'>coming soon</span>
          </h3>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition text-sm'>
            Soạn hợp đồng
          </div>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition text-sm'>
            Kiểm tra rủi ro hợp đồng
          </div>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition text-sm'>
            Hỗ trợ đàm phán hợp đồng
          </div>
        </div>
      </div>

      {/* Footer Menu */}
      <div className='font-sans mt-auto'>
        <div className='p-2 flex flex-col gap-1'>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2 text-sm'>
            <img src='/assets/profile.svg' alt='Profile' className='w-5 h-5' />
            Profile
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2 text-sm'>
            <img src='/assets/settings.svg' alt='Settings' className='w-5 h-5' />
            Settings
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2 text-sm'>
            <img src='/assets/help.svg' alt='Help' className='w-5 h-5' />
            Help
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2 text-sm'>
            <img src='/assets/logout.svg' alt='Log Out' className='w-5 h-5' />
            Log Out
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
