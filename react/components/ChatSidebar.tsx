import React from 'react'
import LawyerConnect from './LawyerConnect'
import type { ChatHistory } from '../types'

interface ChatSidebarProps {
  sidebarOpen: boolean
  chatHistories: ChatHistory[]
  activeChatId: string | null
  showLawyers: boolean
  startNewChat: () => void
  setActiveChatId: (id: string) => void
  toggleLawyersPanel: () => void
  formatDate: (date: Date) => string
  className?: string
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sidebarOpen,
  chatHistories,
  activeChatId,
  showLawyers,
  startNewChat,
  setActiveChatId,
  toggleLawyersPanel,
  formatDate,
  className
}) => {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-72' : 'w-0'
      } transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-700 bg-gray-800 h-full ${className || ''}`}
    >
      <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
        <h2 className='text-xl font-bold text-blue-400'>Lawzy</h2>
        <button onClick={startNewChat} className='px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm'>
          + Chat mới
        </button>
      </div>
      <div className='p-2 border-b border-gray-700'>
        <h3 className='text-sm text-gray-400 mb-2 px-2'>Lịch sử hội thoại</h3>
        <div className='space-y-1'>
          {chatHistories.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                activeChatId === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <div className='text-sm font-medium truncate'>{chat.title}</div>
              <div className='text-xs text-gray-400'>{formatDate(chat.date)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-auto p-4 border-t border-gray-700'>
        <LawyerConnect showLawyers={showLawyers} toggleLawyersPanel={toggleLawyersPanel} />
      </div>
    </div>
  )
}

export default ChatSidebar 