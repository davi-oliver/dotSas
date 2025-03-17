"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 
import MeetingsCalendar from "./meetings-calendar"
 
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, List } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Meeting } from "./types"
import MeetingsList from "./meetings-list"
import MeetingDetails from "./meetings-details"
import CreateMeetingForm from "./create-meetings-form"

// Dados de exemplo
const MOCK_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Reunião de Planejamento Estratégico",
    description: "Discussão sobre as metas do próximo trimestre e alinhamento de objetivos estratégicos.",
    startTime: new Date(2025, 2, 17, 10, 0),
    endTime: new Date(2025, 2, 17, 11, 30),
    location: "Sala de Conferência A",
    meetingUrl: "https://meet.example.com/abc123",
    type: "internal",
    status: "scheduled",
    recurrence: "weekly",
    organizer: {
      id: "org1",
      name: "Ana Silva",
      email: "ana.silva@empresa.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: [
      {
        id: "p1",
        name: "Carlos Oliveira",
        email: "carlos@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        id: "p2",
        name: "Mariana Costa",
        email: "mariana@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "p3",
        name: "Rafael Santos",
        email: "rafael@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "2",
    title: "Apresentação de Novos Produtos",
    description: "Apresentação dos novos produtos que serão lançados no próximo mês.",
    startTime: new Date(2025, 2, 18, 14, 0),
    endTime: new Date(2025, 2, 18, 15, 30),
    location: "Auditório Principal",
    type: "external",
    status: "scheduled",
    organizer: {
      id: "org2",
      name: "Roberto Almeida",
      email: "roberto@empresa.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: [
      {
        id: "p1",
        name: "Carlos Oliveira",
        email: "carlos@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
      {
        id: "p4",
        name: "Juliana Lima",
        email: "juliana@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "3",
    title: "Revisão de Desempenho",
    description: "Revisão trimestral de desempenho da equipe de desenvolvimento.",
    startTime: new Date(2025, 2, 16, 9, 0),
    endTime: new Date(2025, 2, 16, 10, 0),
    location: "Sala de Reuniões B",
    type: "internal",
    status: "completed",
    organizer: {
      id: "org1",
      name: "Ana Silva",
      email: "ana.silva@empresa.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    participants: [
      {
        id: "p1",
        name: "Carlos Oliveira",
        email: "carlos@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
    ],
  },
  {
    id: "4",
    title: "Consulta Médica",
    description: "Consulta de rotina anual.",
    startTime: new Date(2025, 2, 19, 16, 0),
    endTime: new Date(2025, 2, 19, 17, 0),
    location: "Clínica Central",
    type: "personal",
    status: "scheduled",
    organizer: {
      id: "p1",
      name: "Carlos Oliveira",
      email: "carlos@empresa.com",
      avatar: "/placeholder.svg?height=40&width=40",
      isCurrentUser: true,
    },
    participants: [
      {
        id: "p1",
        name: "Carlos Oliveira",
        email: "carlos@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      },
    ],
  },
]

export default function MeetingsInterface() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("calendar")
//   const isMobile = useMobile()

  useEffect(() => {
    // Simulando carregamento de dados
    setMeetings(MOCK_MEETINGS)
  }, [])

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsDetailsOpen(true)
  }

  const handleCreateMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [...prev, newMeeting])
    setIsCreateFormOpen(false)
  }

  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeetings((prev) => prev.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting)))
    setSelectedMeeting(updatedMeeting)
  }

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== meetingId))
    setIsDetailsOpen(false)
    setSelectedMeeting(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reuniões</h1>
          <p className="text-muted-foreground">Gerencie suas reuniões e compromissos</p>
        </div>
        <Button onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reunião
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Lista</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <MeetingsCalendar meetings={meetings} onMeetingClick={handleMeetingClick} />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <MeetingsList meetings={meetings} onMeetingClick={handleMeetingClick} />
        </TabsContent>
      </Tabs>

      {selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onUpdate={handleUpdateMeeting}
          onDelete={handleDeleteMeeting}
        />
      )}

      <CreateMeetingForm isOpen={isCreateFormOpen} onOpenChange={setIsCreateFormOpen} onSubmit={handleCreateMeeting} />
    </div>
  )
}

