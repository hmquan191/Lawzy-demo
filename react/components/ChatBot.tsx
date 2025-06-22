// ChatBot.tsx
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatInterface from './ChatInterface'
import BotTypingMessage from './BotTypingMessage'
import { markdownToHTML } from '../utils/markdownUtils'
import DiagramSection from './DiagramSection'
import type { Message, ChatHistory } from '../types'

const ChatBot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLawyers, setShowLawyers] = useState(false)
  const [diagram, setDiagram] = useState<any>(null)

  useEffect(() => {
    let storedId = localStorage.getItem('sessionId')
    if (!storedId) {
      storedId = uuidv4()
      localStorage.setItem('sessionId', storedId)
    }
    setSessionId(storedId)

    const mockHistories: ChatHistory[] = [
      { id: 'hist1', title: 'Tư vấn hợp đồng thuê nhà', date: new Date(2023, 5, 15) },
      { id: 'hist2', title: 'Vấn đề tranh chấp đất đai', date: new Date(2023, 6, 22) },
      { id: 'hist3', title: 'Thủ tục ly hôn', date: new Date(2023, 7, 3) }
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

    try {
      const res = await fetch('http://localhost:3001/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId })
      })

      const data = await res.json()
      let diagramJson = null
      let cleanText = data.output

      try {
        const match = data.output.match(/{\s*\"diagram\"\s*:[\s\S]*?}/)
        if (match) {
          diagramJson = JSON.parse(match[0])
          cleanText = data.output.replace(match[0], '').trim()
        }
      } catch (err) {
        console.warn('Lỗi parse sơ đồ:', err)
      }

      const botReply: Message = {
        from: 'bot',
        text: cleanText,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botReply])
      if (diagramJson) setDiagram(diagramJson)

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
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '⚠️ Đã xảy ra lỗi khi gửi tin nhắn.', timestamp: new Date() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white overflow-hidden'>
      <div className='flex flex-1 h-full overflow-hidden'>
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          chatHistories={chatHistories}
          activeChatId={activeChatId}
          showLawyers={showLawyers}
          startNewChat={() => setMessages([])}
          setActiveChatId={setActiveChatId}
          toggleLawyersPanel={() => setShowLawyers(!showLawyers)}
          formatDate={formatDate}
        />

        <div className='flex-1 flex flex-col h-full overflow-hidden'>
          <ChatHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sessionId={sessionId} />

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
        </div>

        {diagram && <DiagramSection diagramData={diagram} />}
      </div>
    </div>
  )
}

export default ChatBot
