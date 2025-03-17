export interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
}

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "file"
    url: string
    name?: string
    size?: number
  }[]
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  messages: Message[]
  isTyping?: boolean
  isGroup?: boolean
}

