"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" 
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, ChevronDown, Paperclip, Send, Image, File, Smile } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Conversation, Message, User } from "./types"

interface MessageAreaProps {
  conversation: Conversation
  currentUser: User | null
  onSendMessage: (content: string) => void
  onBack: () => void
  isMobile: boolean
}

export default function MessageArea({ conversation, currentUser, onSendMessage, onBack, isMobile }: MessageAreaProps) {
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages])

  // Verificar quando mostrar o botão de rolagem
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText)
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getOtherParticipant = () => {
    return conversation.participants.find((p: User) => p.id !== currentUser?.id)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatMessageTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR })
  }

  const formatMessageDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoje"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return format(date, "dd 'de' MMMM", { locale: ptBR })
    }
  }

  const renderMessageStatus = (message: Message) => {
    if (message.sender !== currentUser?.id) return null

    switch (message.status) {
      case "sent":
        return <span className="text-muted-foreground">✓</span>
      case "delivered":
        return <span className="text-muted-foreground">✓✓</span>
      case "read":
        return <span className="text-primary">✓✓</span>
      default:
        return null
    }
  }

  // Agrupar mensagens por data
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = []

    conversation.messages.forEach((message: Message) => {
      const dateStr = formatMessageDate(message.timestamp)
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.messages.push(message)
      } else {
        groups.push({ date: dateStr, messages: [message] })
      }
    })

    return groups
  }

  const otherParticipant = getOtherParticipant()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <div className="relative">
          <Avatar>
            <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
            <AvatarFallback>{otherParticipant ? getInitials(otherParticipant.name) : "??"}</AvatarFallback>
          </Avatar>
          {otherParticipant?.status === "online" && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
          )}
        </div>

        <div>
          <h3 className="font-medium">{otherParticipant?.name}</h3>
        </div>

        <div>
          <h3 className="font-medium">{otherParticipant?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {otherParticipant?.status === "online"
              ? "Online"
              : otherParticipant?.status === "away"
                ? "Ausente"
                : "Offline"}
            {conversation.isTyping && " • Digitando..."}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={messagesContainerRef}>
        {groupMessagesByDate().map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <span className="relative bg-background px-2 text-xs text-muted-foreground">{group.date}</span>
            </div>

            {group.messages.map((message, messageIndex) => {
              const isCurrentUser = message.sender === currentUser?.id
              const showAvatar = messageIndex === 0 || group.messages[messageIndex - 1].sender !== message.sender

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                    {!isCurrentUser && showAvatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                        <AvatarFallback>{otherParticipant ? getInitials(otherParticipant.name) : "??"}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8" />
                    )}

                    <div
                      className={`
                        rounded-lg px-4 py-2 max-w-full break-words
                        ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}
                      `}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div
                        className={`
                          text-xs mt-1 flex justify-end items-center gap-1
                          ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}
                        `}
                      >
                        {formatMessageTime(message.timestamp)}
                        {renderMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-6">
          <Button size="icon" className="rounded-full shadow-md" onClick={scrollToBottom}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Image className="h-4 w-4 mr-2" />
                Enviar imagem
              </DropdownMenuItem>
              <DropdownMenuItem>
                <File className="h-4 w-4 mr-2" />
                Enviar arquivo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Smile className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <Input
              placeholder="Digite uma mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="rounded-full"
            />
          </div>

          <Button
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

