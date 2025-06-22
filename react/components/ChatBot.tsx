import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatInterface from './ChatInterface'
import BotTypingMessage from './BotTypingMessage'
import { markdownToHTML } from '../utils/markdownUtils'
// import { formatDate, formatTime } from '../utils/dateUtils'
import { extractMermaidCode } from '../utils/diagramUtils'
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

  const latestBotMsgWithDiagram = [...messages]
    .reverse()
    .find((msg) => msg.from === 'bot' && msg.text.includes('```mermaid'))

  const mermaidCode = latestBotMsgWithDiagram ? extractMermaidCode(latestBotMsgWithDiagram.text) : null

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
        text: '# Chào mừng bạn đến với Lawzy!\nTôi là trợ lý AI pháp lý, có thể giúp bạn:\n- Giải đáp thắc mắc về luật pháp\n- Hướng dẫn thủ tục pháp lý\n- Phân tích tài liệu pháp lý\n- Kết nối với luật sư chuyên nghiệp\nBạn cần hỗ trợ gì hôm nay?',
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

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        chatHistories={chatHistories}
        activeChatId={activeChatId}
        showLawyers={showLawyers}
        startNewChat={startNewChat}
        setActiveChatId={setActiveChatId}
        toggleLawyersPanel={toggleLawyersPanel}
        formatDate={formatDate}
      />

      {/* Main chat area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <ChatHeader toggleSidebar={toggleSidebar} sessionId={sessionId} />

        {/* Chat Interface */}
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
      {/* Diagram Section */}
      {mermaidCode && <DiagramSection mermaidCode={mermaidCode} />}
    </div>
  )
}

export default ChatBot
