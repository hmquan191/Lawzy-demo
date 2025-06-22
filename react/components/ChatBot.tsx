import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Message {
  from: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  date: Date
}

interface Lawyer {
  id: string
  name: string
  specialty: string
  rating: number
  online: boolean
  avatar: string
}

const markdownToHTML = (markdown: string): string => {
  // Convert headings
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Convert links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    )
    // Convert lists
    .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^\* (.*)/gim, '<li>$1</li>')
    .replace(/^\s*\n- (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^- (.*)/gim, '<li>$1</li>')
    // Convert code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 p-2 rounded my-2"><code>$1</code></pre>')
    // Convert inline code
    .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-1 rounded">$1</code>')
    // Convert paragraphs
    .replace(/^\s*\n\s*\n/gim, '</p><p>')
    // Convert line breaks
    .replace(/\n/gim, '<br>')

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<p')) {
    html = '<p>' + html + '</p>'
  }

  return html
}

// Simple function to convert markdown to HTML remain no change
// BotTypingMessage component for typing effect
interface BotTypingMessageProps {
  text: string
  timestamp: Date
  showFull: boolean
  markdownToHTML: (markdown: string) => string
  formatTime: (date: Date) => string
}

const BotTypingMessage: React.FC<BotTypingMessageProps> = ({
  text,
  timestamp,
  showFull,
  markdownToHTML,
  formatTime
}) => {
  const [displayed, setDisplayed] = useState<string>('')
  useEffect(() => {
    if (showFull) {
      setDisplayed(text)
      return
    }
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 15)
    return () => clearInterval(interval)
  }, [text, showFull])
  return (
    <div>
      <div className='mb-1' dangerouslySetInnerHTML={{ __html: markdownToHTML(displayed) }} />
      <div className='text-xs text-blue-300 text-right'>{formatTime(timestamp)}</div>
    </div>
  )
}

const ChatBot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLawyers, setShowLawyers] = useState(false)

  // Mock lawyers data
  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      specialty: 'Luật Dân sự',
      rating: 4.8,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      specialty: 'Luật Hình sự',
      rating: 4.9,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      specialty: 'Luật Đất đai',
      rating: 4.7,
      online: false,
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      specialty: 'Luật Doanh nghiệp',
      rating: 4.6,
      online: true,
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
    }
  ]

  // Khởi tạo sessionId và chat histories
  useEffect(() => {
    let storedId = localStorage.getItem('sessionId')
    if (!storedId) {
      storedId = uuidv4()
      localStorage.setItem('sessionId', storedId)
    }
    setSessionId(storedId)

    // Load mock chat histories
    const mockHistories: ChatHistory[] = [
      {
        id: 'hist1',
        title: 'Tư vấn hợp đồng thuê nhà',
        date: new Date(2023, 5, 15)
      },
      {
        id: 'hist2',
        title: 'Vấn đề tranh chấp đất đai',
        date: new Date(2023, 6, 22)
      },
      { id: 'hist3', title: 'Thủ tục ly hôn', date: new Date(2023, 7, 3) }
    ]
    setChatHistories(mockHistories)

    // Set welcome message
    setMessages([
      {
        from: 'bot',
        text: '# Chào mừng bạn đến với Lawzy!\n\nTôi là trợ lý AI pháp lý, có thể giúp bạn:\n\n- Giải đáp thắc mắc về luật pháp\n- Hướng dẫn thủ tục pháp lý\n- Phân tích tài liệu pháp lý\n- Kết nối với luật sư chuyên nghiệp\n\nBạn cần hỗ trợ gì hôm nay?',
        timestamp: new Date()
      }
    ])
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: Message = {
      from: 'user',
      text: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId
        })
      })

      const data = await res.json()
      const botReply: Message = {
        from: 'bot',
        text: data.output || data.reply || 'Không nhận được phản hồi từ chatbot.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botReply])

      // Create new chat history if this is the first message
      if (messages.length <= 1) {
        const newChatId = uuidv4()
        const newChat: ChatHistory = {
          id: newChatId,
          title: input.length > 30 ? input.substring(0, 30) + '...' : input,
          date: new Date()
        }
        setChatHistories((prev) => [newChat, ...prev])
        setActiveChatId(newChatId)
      }
    } catch (error) {
      console.log(error)
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '⚠️ Đã xảy ra lỗi khi gửi tin nhắn.',
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        from: 'bot',
        text: '# Chào mừng bạn đến với Lawzy!\n\nTôi là trợ lý AI pháp lý, có thể giúp bạn:\n\n- Giải đáp thắc mắc về luật pháp\n- Hướng dẫn thủ tục pháp lý\n- Phân tích tài liệu pháp lý\n- Kết nối với luật sư chuyên nghiệp\n\nBạn cần hỗ trợ gì hôm nay?',
        timestamp: new Date()
      }
    ])
    setActiveChatId(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleLawyersPanel = () => {
    setShowLawyers(!showLawyers)
  }

  const connectWithLawyer = (lawyerId: string) => {
    alert(`Yêu cầu kết nối với luật sư ID: ${lawyerId} đã được gửi.`)
  }

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-700 bg-gray-800`}
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
          <button
            onClick={toggleLawyersPanel}
            className='w-full py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2'
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
            Kết nối Luật sư
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
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

      {/* Lawyers panel (sliding from right) */}
      <div
        className={`w-80 border-l border-gray-700 bg-gray-800 transition-all duration-300 overflow-hidden ${
          showLawyers ? 'translate-x-0' : 'translate-x-full'
        } absolute right-0 top-0 bottom-0`}
      >
        <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
          <h2 className='font-bold'>Luật sư trực tuyến</h2>
          <button onClick={toggleLawyersPanel} className='p-1 hover:bg-gray-700 rounded'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <div className='p-4 space-y-4'>
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className='bg-gray-700 rounded-lg p-3'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <img src={lawyer.avatar} alt={lawyer.name} className='w-12 h-12 rounded-full object-cover' />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      lawyer.online ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></div>
                </div>
                <div className='flex-1'>
                  <div className='font-medium'>{lawyer.name}</div>
                  <div className='text-sm text-gray-300'>{lawyer.specialty}</div>
                  <div className='flex items-center text-yellow-400 text-sm mt-1'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='ml-1'>{lawyer.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => connectWithLawyer(lawyer.id)}
                className={`mt-3 w-full py-1.5 rounded text-sm ${
                  lawyer.online ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!lawyer.online}
              >
                {lawyer.online ? 'Kết nối ngay' : 'Không trực tuyến'}
              </button>
            </div>
          ))}
        </div>
        <div className='p-4 border-t border-gray-700'>
          <button className='w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm'>Xem tất cả luật sư</button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
