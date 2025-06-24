import React, { useEffect, useRef } from 'react'
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

  // Scroll to bottom whenever messages change or loading state updates
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    scrollToBottom()
  }, [messages, loading]) // Trigger when messages or loading changes

  return (
    <div className='flex-1 flex flex-col h-full overflow-hidden font-sans'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 bg-white min-h-0 max-h-full'>
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-4 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'bot' && (
              <div className='h-8 w-8 rounded-full bg-[#fc8e5a] flex items-center justify-center mr-2 flex-shrink-0'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
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
              className={`px-4 py-3 rounded-xl max-w-[75%] shadow-sm ${
                msg.from === 'user' ? 'bg-[#fc8e5a] text-white' : 'bg-[#fefff9] text-gray-800 border border-gray-100'
              }`}
            >
              {msg.from === 'user' ? (
                <div>
                  <div className='mb-1'>{msg.text}</div>
                  <div className='text-xs text-white text-right'>{formatTime(msg.timestamp)}</div>
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
              <div className='h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ml-2 flex-shrink-0'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
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
            <div className='h-8 w-8 rounded-full bg-[#fc8e5a] flex items-center justify-center mr-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-white'
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
            <div className='px-4 py-3 rounded-xl bg-[#fefff9] border border-gray-100 shadow-sm'>
              <div className='flex space-x-1'>
                <div
                  className='w-2 h-2 bg-[#fc8e5a] rounded-full animate-bounce'
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className='w-2 h-2 bg-[#fc8e5a] rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className='w-2 h-2 bg-[#fc8e5a] rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className='p-4 border-t border-gray-200 bg-white flex-shrink-0 font-sans'>
        <div className='flex gap-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className='flex-1 p-3 rounded-lg border border-gray-300 bg-[#fefff9] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fc8e5a]'
            placeholder='Nhập câu hỏi pháp lý của bạn...'
          />
          <button
            onClick={handleSend}
            className='bg-[#fc8e5a] hover:bg-[#fc8e5a]/90 px-4 py-2 rounded-lg text-white flex items-center'
            disabled={loading}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
            </svg>
          </button>
        </div>
        <div className='text-xs text-gray-500 mt-2 text-center'>
          Lawzy cung cấp thông tin tham khảo, không thay thế tư vấn pháp lý chuyên nghiệp.
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
