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

export interface DiagramData {
  type: string
  content: string
}

export interface LawyerLocation {
  lat: number
  lng: number
  address: string
}

export interface Lawyer {
  id: string
  name: string
  specialty: string
  rating: number
  online: boolean 
  avatar: string
  location?: LawyerLocation
  distance?: number
  estimatedTime?: number
  reviewCount?: number
  address?: string
  bio?: string
}
