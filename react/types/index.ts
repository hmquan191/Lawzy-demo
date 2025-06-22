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

// types/index.ts

export interface NodeData {
  id: string
  label: string
  type?: string // (optional) dùng cho custom node sau này
  position?: { x: number; y: number } // nếu bạn muốn định nghĩa vị trí tay
}

export interface EdgeData {
  from: string
  to: string
  label?: string
}

export interface DiagramData {
  type: 'flowchart' | 'decisionTree' | string // mở rộng sau nếu có
  nodes: NodeData[]
  edges: EdgeData[]
}
