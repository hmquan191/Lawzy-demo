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
      <div className='p-4 flex flex-col gap-4 items-center justify-between'>
        <div className='flex items-center justify-center'>
          <h1 className='text-3xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold'>
            Lawzy
          </h1>
        </div>

        <button
          onClick={startNewChat}
          className='w-full py-3 px-4 bg-[#fc8e5a] text-white hover:bg-[#fc8e5a]/90 rounded-md flex items-center gap-2 justify-center'
        >
          {/* <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg> */}
          <h1 className='text-1xl font-sans text-center'>New Chat</h1>
        </button>
      </div>

      {/* Chat History */}
      <div className='p-2 border-b border-gray-200'>
        <h3 className='text-sm font-sans text-gray-400 mb-2 px-2'>Lịch sử hội thoại</h3>
        <div className='space-y-1'>
          {chatHistories.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 font-sans rounded cursor-pointer hover:bg-gray-100 ${
                activeChatId === chat.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <div className='text-sm mt-1 text-gray-800'>{chat.title}</div>
              <div className='text-xs text-gray-400'>{formatDate(chat.date)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4 p-4 font-sans'>
        <h3 className='text-xl mb-3 text-gray-800'>Explore Lawzy</h3>
        <div className='flex flex-col gap-3'>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition'>
            Soạn hợp đồng
          </div>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition'>
            Kiểm tra rủi ro hợp đồng
          </div>
          <div className='hover:bg-gray-100 rounded px-3 py-2 cursor-pointer text-gray-700 transition'>
            Hỗ trợ đàm phán hợp đồng
          </div>
        </div>
      </div>

      {/* Footer Menu */}
      <div className=' font-sans mt-auto'>
        <div className='p-2'>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2'>
            <img src='/assets/profile.svg' alt='Profile' className='w-5 h-5 m-1' />
            Profile
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2'>
            <img src='/assets/settings.svg' alt='Settings' className='w-5 h-5 m-1' />
            Settings
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2'>
            <img src='/assets/help.svg' alt='Help' className='w-5 h-5 m-1' />
            Help
          </div>
          <div className='p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-800 flex items-center gap-2'>
            <img src='/assets/logout.svg' alt='Log Out' className='w-5 h-5 m-1' />
            Log Out
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
