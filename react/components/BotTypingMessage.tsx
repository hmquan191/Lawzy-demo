import React, { useState, useEffect } from 'react'

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
    }, 0.1)

    return () => clearInterval(interval)
  }, [text, showFull])

  return (
    <div className="font-['Inter']">
      <div className='mb-1 prose prose-sm max-w-none prose-headings:text-gray-800 prose-a:text-[#fc8e5a]' dangerouslySetInnerHTML={{ __html: markdownToHTML(displayed) }} />
      <div className='text-xs text-gray-500 text-right'>{formatTime(timestamp)}</div>
    </div>
  )
}

export default BotTypingMessage
