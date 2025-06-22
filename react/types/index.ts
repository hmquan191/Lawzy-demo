export interface Message {
  from: 'user' | 'bot'
  text: string
  timestamp: Date
}

export interface ChatHistory {
  id: string
  title: string
  date: Date
} 