// ChatBot.tsx
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatInterface from './ChatInterface'
import BotTypingMessage from './BotTypingMessage'
import DiagramSection from './DiagramSection'
import LawyerPopup from './LawyerPopup'
import { markdownToHTML } from '../utils/markdownUtils'
import type { Message, ChatHistory, DiagramData } from '../types'
import { extractDiagramJson } from '../utils/parseUtils'

const ChatBot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLawyers, setShowLawyers] = useState<boolean>(false)
  const [diagram, setDiagram] = useState<DiagramData | null>(null)

  useEffect(() => {
    let storedId = localStorage.getItem('sessionId')
    if (!storedId) {
      storedId = uuidv4()
      localStorage.setItem('sessionId', storedId)
    }
    setSessionId(storedId)

    const mockHistories: ChatHistory[] = [
      // { id: 'hist1', title: 'Tư vấn hợp đồng thuê nhà', date: new Date(2025, 15 - 1, 6) }, // 15/06/2025
      // { id: 'hist2', title: 'Tranh chấp đất đai', date: new Date(2025, 22 - 1, 7) }, // 22/07/2025
      // { id: 'hist3', title: 'Thủ tục ly hôn', date: new Date(2025, 3 - 1, 8) } // 03/08/2025
    ]
    setChatHistories(mockHistories)

    setMessages([
      {
        from: 'bot',
        text: '# Chào mừng bạn đến với Lawzy!\nTôi là trợ lý AI pháp lý, có thể giúp bạn:\n- Giải đáp thắc mắc về luật pháp\n- Hướng dẫn thủ tục pháp lý\n- Phân tích tài liệu pháp lý\n- Kết nối với luật sư chuyên nghiệp\n\nBạn cần hỗ trợ gì hôm nay?',
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
    // ("https://lawzy-backend.onrender.com/api/chatbot"
    try {
      const res = await fetch('https://lawzy-backend.onrender.com/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId })
      })

      const data = await res.json()
      let rawOutput = data.output

      if (typeof rawOutput !== 'string') {
        rawOutput = JSON.stringify(rawOutput)
      }

      const { text: cleanText, diagram } = extractDiagramJson(rawOutput)

      console.log('✅ Bot trả về text:', cleanText)
      console.log('📊 Parsed diagram:', diagram)

      setMessages((prev) => [...prev, { from: 'bot', text: cleanText, timestamp: new Date() }])
      setDiagram(diagram)

      if (messages.length <= 1) {
        const newChatId = uuidv4()
        const newChat: ChatHistory = {
          id: newChatId,
          title: input.slice(0, 30) + '...',
          date: new Date()
        }
        setChatHistories((prev) => [newChat, ...prev])
        setActiveChatId(newChatId)
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi hoặc xử lý phản hồi chatbot:', err)
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '⚠️ Đã xảy ra lỗi khi gửi tin nhắn.', timestamp: new Date() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })

  return (
    <div className='flex flex-col h-screen bg-white text-gray-800 overflow-hidden font-["Product_Sans"]'>
      <div className='flex flex-1 h-full overflow-hidden'>
        {/* Sidebar lịch sử chat */}
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          chatHistories={chatHistories}
          activeChatId={activeChatId}
          startNewChat={() => setMessages([])}
          setActiveChatId={setActiveChatId}
          className='h-full'
          formatDate={formatDate}
        />

        {/* Khung chat chính */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          <ChatHeader
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sessionId={sessionId}
            showLawyers={showLawyers}
            toggleLawyersPanel={() => setShowLawyers(!showLawyers)}
          />

          <div className='flex flex-1 overflow-hidden'>
            <ChatInterface
              messages={messages}
              loading={loading}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              markdownToHTML={markdownToHTML}
              formatTime={formatTime}
              BotTypingMessage={BotTypingMessage}
            />

            {/* Panel bên phải: chỉ hiển thị sơ đồ */}
            {diagram && (
              <div className='w-[400px] bg-[#fefff9] border-l border-gray-200 flex flex-col'>
              <div className='p-3 border-b border-gray-200 flex items-center justify-between'>
                <h3 className='font-medium'>📊 Sơ đồ minh họa</h3>
              </div>
              <div className='flex-1 overflow-auto'>
                <DiagramSection diagramData={diagram} key={JSON.stringify(diagram)} />
              </div>
              </div>
            )}
          

            {/* Popup kết nối luật sư */}
            <LawyerPopup isOpen={showLawyers} onClose={() => setShowLawyers(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
