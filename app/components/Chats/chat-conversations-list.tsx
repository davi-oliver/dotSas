"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
 
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Plus, Search, User2 } from "lucide-react"
import { Conversation } from "./types"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  isLoading: boolean
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar conversas baseado no termo de busca
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== "current-user")
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Ordenar conversas por timestamp da última mensagem (mais recente primeiro)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime(),
  )

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== "current-user")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500"
      case "away":
        return "bg-amber-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Conversas</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <User2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">Nenhuma conversa encontrada</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "Tente outro termo de busca" : "Inicie uma nova conversa"}
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {sortedConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              if (!otherParticipant) return null

              return (
                <li
                  key={conversation.id}
                  className={`
                    p-4 hover:bg-muted/50 cursor-pointer relative
                    ${selectedConversationId === conversation.id ? "bg-muted" : ""}
                  `}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                        <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(otherParticipant.status)}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.isTyping ? (
                            <span className="text-primary italic">Digitando...</span>
                          ) : (
                            <>
                              {conversation.lastMessage.sender === "current-user" && "Você: "}
                              {conversation.lastMessage.content}
                            </>
                          )}
                        </p>

                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>
    </div>
  )
}

