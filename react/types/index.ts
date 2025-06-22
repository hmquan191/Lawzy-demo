// types.ts
export interface DiagramNode {
  id: string
  label: string
}

export interface DiagramEdge {
  from: string
  to: string
  label: string
}

export interface DiagramData {
  type: string
  nodes: { id: string; label: string }[]
  edges: { from: string; to: string; label: string }[]
}

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
