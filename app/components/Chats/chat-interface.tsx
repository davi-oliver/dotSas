"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Conversation, Message, User } from "./types"
import ConversationList from "./chat-conversations-list"
import MessageArea from "./message-area"
 

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showConversationList, setShowConversationList] = useState(!isMobile)

  useEffect(() => {
    // Simulação de carregamento de dados
    const loadData = async () => {
      setIsLoading(true)

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuário atual
      const mockCurrentUser: User = {
        id: "current-user",
        name: "Você",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      }

      // Conversas de exemplo
      const mockConversations: Conversation[] = [
        {
          id: "conv-1",
          participants: [
            mockCurrentUser,
            {
              id: "user-1",
              name: "João Silva",
              avatar: "/placeholder.svg?height=40&width=40",
              status: "online",
            },
          ],
          lastMessage: {
            id: "msg-1-last",
            sender: "user-1",
            content: "Podemos marcar uma reunião amanhã?",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            status: "read",
          },
          unreadCount: 0,
          messages: [
            {
              id: "msg-1-1",
              sender: "user-1",
              content: "Olá, tudo bem?",
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              status: "read",
            },
            {
              id: "msg-1-2",
              sender: "current-user",
              content: "Tudo ótimo! E com você?",
              timestamp: new Date(Date.now() - 1000 * 60 * 25),
              status: "read",
            },
            {
              id: "msg-1-3",
              sender: "user-1",
              content: "Estou bem também! Precisamos discutir o novo projeto.",
              timestamp: new Date(Date.now() - 1000 * 60 * 20),
              status: "read",
            },
            {
              id: "msg-1-4",
              sender: "current-user",
              content: "Claro, quando você tem disponibilidade?",
              timestamp: new Date(Date.now() - 1000 * 60 * 15),
              status: "read",
            },
            {
              id: "msg-1-last",
              sender: "user-1",
              content: "Podemos marcar uma reunião amanhã?",
              timestamp: new Date(Date.now() - 1000 * 60 * 5),
              status: "read",
            },
          ],
        },
        {
          id: "conv-2",
          participants: [
            mockCurrentUser,
            {
              id: "user-2",
              name: "Maria Oliveira",
              avatar: "/placeholder.svg?height=40&width=40",
              status: "offline",
            },
          ],
          lastMessage: {
            id: "msg-2-last",
            sender: "user-2",
            content: "Verifiquei o relatório e encontrei algumas inconsistências.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            status: "read",
          },
          unreadCount: 0,
          messages: [
            {
              id: "msg-2-1",
              sender: "current-user",
              content: "Maria, você já revisou o relatório mensal?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
              status: "read",
            },
            {
              id: "msg-2-2",
              sender: "user-2",
              content: "Estou finalizando a revisão agora.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
              status: "read",
            },
            {
              id: "msg-2-last",
              sender: "user-2",
              content: "Verifiquei o relatório e encontrei algumas inconsistências.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              status: "read",
            },
          ],
        },
        {
          id: "conv-3",
          participants: [
            mockCurrentUser,
            {
              id: "user-3",
              name: "Pedro Santos",
              avatar: "/placeholder.svg?height=40&width=40",
              status: "away",
            },
          ],
          lastMessage: {
            id: "msg-3-last",
            sender: "user-3",
            content: "Acabei de enviar os arquivos por email.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "delivered",
          },
          unreadCount: 1,
          messages: [
            {
              id: "msg-3-1",
              sender: "current-user",
              content: "Pedro, preciso dos arquivos do projeto até hoje.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60),
              status: "read",
            },
            {
              id: "msg-3-2",
              sender: "user-3",
              content: "Estou finalizando e envio em breve.",
              timestamp: new Date(Date.now() - 1000 * 60 * 45),
              status: "read",
            },
            {
              id: "msg-3-last",
              sender: "user-3",
              content: "Acabei de enviar os arquivos por email.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              status: "delivered",
            },
          ],
        },
        {
          id: "conv-4",
          participants: [
            mockCurrentUser,
            {
              id: "user-4",
              name: "Ana Costa",
              avatar: "/placeholder.svg?height=40&width=40",
              status: "online",
            },
          ],
          lastMessage: {
            id: "msg-4-last",
            sender: "current-user",
            content: "Vamos agendar uma call para discutir os detalhes?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            status: "read",
          },
          unreadCount: 0,
          messages: [
            {
              id: "msg-4-1",
              sender: "user-4",
              content: "Olá! Gostaria de discutir o novo design do site.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
              status: "read",
            },
            {
              id: "msg-4-2",
              sender: "current-user",
              content: "Claro, Ana! Tenho algumas ideias para compartilhar.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
              status: "read",
            },
            {
              id: "msg-4-last",
              sender: "current-user",
              content: "Vamos agendar uma call para discutir os detalhes?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
              status: "read",
            },
          ],
        },
        {
          id: "conv-5",
          participants: [
            mockCurrentUser,
            {
              id: "user-5",
              name: "Carlos Ferreira",
              avatar: "/placeholder.svg?height=40&width=40",
              status: "online",
            },
          ],
          lastMessage: {
            id: "msg-5-last",
            sender: "user-5",
            content: "Precisamos revisar o orçamento para o próximo trimestre.",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            status: "sent",
          },
          unreadCount: 3,
          messages: [
            {
              id: "msg-5-1",
              sender: "user-5",
              content: "Bom dia! Temos uma reunião com o cliente hoje às 14h.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              status: "sent",
            },
            {
              id: "msg-5-2",
              sender: "user-5",
              content: "Você pode preparar a apresentação?",
              timestamp: new Date(Date.now() - 1000 * 60 * 20),
              status: "sent",
            },
            {
              id: "msg-5-last",
              sender: "user-5",
              content: "Precisamos revisar o orçamento para o próximo trimestre.",
              timestamp: new Date(Date.now() - 1000 * 60 * 10),
              status: "sent",
            },
          ],
        },
      ]

      setCurrentUser(mockCurrentUser)
      setConversations(mockConversations)
      setSelectedConversation(mockConversations[0])
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    // Atualizar visualização baseado no tamanho da tela
    setShowConversationList(!isMobile || (isMobile && !selectedConversation))
  }, [isMobile, selectedConversation])

  const handleSelectConversation = (conversation: Conversation) => {
    // Marcar mensagens como lidas
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map((msg: Message) => ({
        ...msg,
        status: msg.sender !== currentUser?.id ? ("read" as const) : msg.status,
      })),
    }

    // Atualizar a conversa na lista
    setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)))

    setSelectedConversation(updatedConversation)

    // Em mobile, esconder a lista de conversas ao selecionar uma
    if (isMobile) {
      setShowConversationList(false)
    }
  }

  const handleBackToList = () => {
    if (isMobile) {
      setShowConversationList(true)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !content.trim() || !currentUser) return

    // Criar nova mensagem
    const newMessage: Message = {
      id: `msg-new-${Date.now()}`,
      sender: currentUser.id,
      content,
      timestamp: new Date(),
      status: "sent",
    }

    // Atualizar conversa selecionada
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      messages: [...selectedConversation.messages, newMessage],
    }

    // Atualizar estado
    setSelectedConversation(updatedConversation)
    setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)))

    // Simular resposta após alguns segundos
    if (Math.random() > 0.5) {
      simulateResponse(updatedConversation)
    }
  }

  const simulateResponse = (conversation: Conversation) => {
    // Encontrar o outro participante
    const otherUser = conversation.participants.find((p: User) => p.id !== currentUser?.id)
    if (!otherUser) return

    // Simular "digitando"
    setTimeout(() => {
      const updatedConv = {
        ...conversation,
        isTyping: true,
      }
      setSelectedConversation(updatedConv)
      setConversations(conversations.map((conv) => (conv.id === updatedConv.id ? updatedConv : conv)))
    }, 1000)

    // Simular resposta
    setTimeout(() => {
      const responses = [
        "Claro, vamos conversar sobre isso.",
        "Entendi, obrigado pela informação.",
        "Vou verificar e te retorno em breve.",
        "Perfeito! Podemos agendar uma reunião para discutir mais.",
        "Concordo com sua abordagem.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const newMessage: Message = {
        id: `msg-response-${Date.now()}`,
        sender: otherUser.id,
        content: randomResponse,
        timestamp: new Date(),
        status: "sent",
      }

      const updatedConversation = {
        ...conversation,
        isTyping: false,
        lastMessage: newMessage,
        messages: [...conversation.messages, newMessage],
        unreadCount: isMobile && selectedConversation?.id !== conversation.id ? (conversation.unreadCount || 0) + 1 : 0,
      }

      setSelectedConversation((prev: Conversation | null) => (prev?.id === updatedConversation.id ? updatedConversation : prev))

      setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)))
    }, 3000)
  }

  return (
    <div className="flex h-full rounded-lg border bg-background shadow">
      {showConversationList && (
        <div className={`${isMobile ? "w-full" : "w-1/3 border-r"}`}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoading}
          />
        </div>
      )}

      {selectedConversation && !showConversationList && (
        <div className="flex-1">
          <MessageArea
            conversation={selectedConversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
            isMobile={isMobile}
          />
        </div>
      )}

      {!selectedConversation && !isLoading && !isMobile && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Selecione uma conversa</h3>
            <p className="text-muted-foreground">Escolha uma conversa da lista para começar a enviar mensagens</p>
          </div>
        </div>
      )}
    </div>
  )
}

