import React, { useRef } from 'react'
import type { Message } from '../types'

interface ChatInterfaceProps {
  messages: Message[]
  loading: boolean
  input: string
  setInput: (value: string) => void
  handleSend: () => void
  markdownToHTML: (markdown: string) => string
  formatTime: (date: Date) => string
  BotTypingMessage: React.FC<{
    text: string
    timestamp: Date
    showFull: boolean
    markdownToHTML: (markdown: string) => string
    formatTime: (date: Date) => string
  }>
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  loading,
  input,
  setInput,
  handleSend,
  markdownToHTML,
  formatTime,
  BotTypingMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='flex-1 flex flex-col'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-800'>
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-4 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'bot' && (
              <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0'>
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
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-xl max-w-[75%] ${msg.from === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              {msg.from === 'user' ? (
                <div>
                  <div className='mb-1'>{msg.text}</div>
                  <div className='text-xs text-blue-300 text-right'>{formatTime(msg.timestamp)}</div>
                </div>
              ) : (
                <div>
                  <BotTypingMessage
                    text={msg.text}
                    timestamp={msg.timestamp}
                    showFull={idx !== messages.length - 1 || loading}
                    markdownToHTML={markdownToHTML}
                    formatTime={formatTime}
                  />
                </div>
              )}
            </div>
            {msg.from === 'user' && (
              <div className='h-8 w-8 rounded-full bg-green-600 flex items-center justify-center ml-2 flex-shrink-0'>
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className='flex items-center text-gray-400 italic ml-10'>
            <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2'>
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
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                />
              </svg>
            </div>
            <div className='px-4 py-3 rounded-xl bg-gray-700'>
              <div className='flex space-x-1'>
                <div
                  className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className='p-4 border-t border-gray-700 bg-gray-800'>
        <div className='flex gap-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className='flex-1 p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Nhập câu hỏi pháp lý của bạn...'
          />
          <button
            onClick={handleSend}
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white flex items-center'
            disabled={loading}
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
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
          </button>
        </div>
        <div className='text-xs text-gray-400 mt-2 text-center'>
          Lawzy cung cấp thông tin tham khảo, không thay thế tư vấn pháp lý chuyên nghiệp.
        </div>
      </div>
    </div>
  )
}

export default ChatInterface 