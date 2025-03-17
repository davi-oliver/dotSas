
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, MapPin, Users, Search } from "lucide-react"
import { Meeting } from "./types"

interface MeetingsListProps {
    meetings: Meeting[]
    onMeetingClick: (meeting: Meeting) => void
}

export default function MeetingsList({ meetings, onMeetingClick }: MeetingsListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [periodFilter, setPeriodFilter] = useState<string>("all")

    const filteredMeetings = useMemo(() => {
        return meetings.filter((meeting) => {
            // Filtro de busca
            const matchesSearch =
                meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                false ||
                meeting.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                false

            // Filtro de status
            const matchesStatus = statusFilter === "all" || meeting.status === statusFilter

            // Filtro de tipo
            const matchesType = typeFilter === "all" || meeting.type === typeFilter

            // Filtro de período
            let matchesPeriod = true
            if (periodFilter === "today") {
                matchesPeriod = isToday(new Date(meeting.startTime))
            } else if (periodFilter === "tomorrow") {
                matchesPeriod = isTomorrow(new Date(meeting.startTime))
            } else if (periodFilter === "upcoming") {
                matchesPeriod = isFuture(new Date(meeting.startTime))
            } else if (periodFilter === "past") {
                matchesPeriod = isPast(new Date(meeting.endTime))
            }

            return matchesSearch && matchesStatus && matchesType && matchesPeriod
        })
    }, [meetings, searchQuery, statusFilter, typeFilter, periodFilter])

    const formatMeetingDate = (date: Date) => {
        if (isToday(new Date(date))) {
            return "Hoje"
        } else if (isTomorrow(new Date(date))) {
            return "Amanhã"
        } else {
            return format(new Date(date), "EEEE, dd 'de' MMMM", { locale: ptBR })
        }
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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar reuniões..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="scheduled">Agendadas</SelectItem>
                            <SelectItem value="completed">Concluídas</SelectItem>
                            <SelectItem value="cancelled">Canceladas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="internal">Internas</SelectItem>
                            <SelectItem value="external">Externas</SelectItem>
                            <SelectItem value="personal">Pessoais</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={periodFilter} onValueChange={setPeriodFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="tomorrow">Amanhã</SelectItem>
                            <SelectItem value="upcoming">Próximas</SelectItem>
                            <SelectItem value="past">Passadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredMeetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Nenhuma reunião encontrada</h3>
                    <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                        Não encontramos reuniões com os filtros selecionados. Tente ajustar seus filtros ou criar uma nova reunião.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMeetings.map((meeting) => (
                        <Card
                            key={meeting.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onMeetingClick(meeting)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="line-clamp-1">{meeting.title}</CardTitle>
                                        <CardDescription className="line-clamp-1">{formatMeetingDate(meeting.startTime)}</CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        {getStatusBadge(meeting.status)}
                                        {getTypeBadge(meeting.type)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{formatMeetingTime(meeting.startTime, meeting.endTime)}</span>
                                    </div>

                                    {meeting.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="line-clamp-1">{meeting.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{meeting.participants.length} participante(s)</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
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
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

