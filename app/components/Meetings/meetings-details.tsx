"use client"

import { useState } from "react"
import type { Meeting } from "./types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, MapPin, Users, ExternalLink, Edit, Trash2, Copy, Check } from "lucide-react"

interface MeetingDetailsProps {
  meeting: Meeting
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (meeting: Meeting) => void
  onDelete: (meetingId: string) => void
}

export default function MeetingDetails({ meeting, isOpen, onOpenChange, onUpdate, onDelete }: MeetingDetailsProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const formatMeetingDate = (date: Date) => {
    return format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const formatMeetingTime = (startTime: Date, endTime: Date) => {
    return `${format(new Date(startTime), "HH:mm", { locale: ptBR })} - ${format(new Date(endTime), "HH:mm", { locale: ptBR })}`
  }

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Agendada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
            Cancelada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Concluída
          </Badge>
        )
    }
  }

  const getTypeBadge = (type: Meeting["type"]) => {
    switch (type) {
      case "internal":
        return <Badge variant="secondary">Interna</Badge>
      case "external":
        return <Badge variant="outline">Externa</Badge>
      case "personal":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Pessoal
          </Badge>
        )
    }
  }

  const getRecurrenceBadge = (recurrence?: Meeting["recurrence"]) => {
    if (!recurrence || recurrence === "none") return null

    switch (recurrence) {
      case "daily":
        return <Badge variant="outline">Diária</Badge>
      case "weekly":
        return <Badge variant="outline">Semanal</Badge>
      case "monthly":
        return <Badge variant="outline">Mensal</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleCopyMeetingLink = () => {
    if (meeting.meetingUrl) {
      navigator.clipboard.writeText(meeting.meetingUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleDeleteMeeting = () => {
    onDelete(meeting.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{meeting.title}</span>
                {getStatusBadge(meeting.status)}
                {getTypeBadge(meeting.type)}
                {getRecurrenceBadge(meeting.recurrence)}
              </div>
            </DialogTitle>
            <DialogDescription>Detalhes da reunião</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Data e Horário</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMeetingDate(meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMeetingTime(meeting.startTime, meeting.endTime)}</span>
                    </div>
                  </div>
                </div>

                {meeting.location && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Local</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>
                )}

                {meeting.meetingUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Link da Reunião</h3>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={meeting.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {meeting.meetingUrl}
                      </a>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyMeetingLink}>
                        {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                )}

                {meeting.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
                    <p className="text-sm whitespace-pre-wrap">{meeting.description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Organizador</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={meeting.organizer.avatar} alt={meeting.organizer.name} />
                      <AvatarFallback>{getInitials(meeting.organizer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{meeting.organizer.name}</div>
                      <div className="text-sm text-muted-foreground">{meeting.organizer.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Participantes</h3>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{meeting.participants.length}</span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  <div className="flex -space-x-2">
                                    {meeting.participants.slice(0, 3).map((participant: { id: string; avatar?: string; name: string }) => (

                                        <Avatar key={participant.id} className="border-2 border-background">

                                            <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />

                                            <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>

                                        </Avatar>

                                    ))}
                                    {meeting.participants.length > 3 && (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                                            +{meeting.participants.length - 3}
                                        </div>
                                    )}
                                </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center gap-2 sm:gap-0">
            <div>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a reunião e removerá os dados dos
                      nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteMeeting}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

