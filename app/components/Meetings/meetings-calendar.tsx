"use client"

import { useState } from "react"
import type { Meeting } from "./types"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MeetingsCalendarProps {
  meetings: Meeting[]
  onMeetingClick: (meeting: Meeting) => void
}

export default function MeetingsCalendar({ meetings, onMeetingClick }: MeetingsCalendarProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const meetingsOnSelectedDate = selectedDate
    ? meetings.filter((meeting) => isSameDay(new Date(meeting.startTime), selectedDate))
    : []

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const getMeetingsByDate = (date: Date) => {
    return meetings.filter((meeting) => isSameDay(new Date(meeting.startTime), date))
  }

  const formatMeetingTime = (startTime: Date) => {
    return format(new Date(startTime), "HH:mm", { locale: ptBR })
  }

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "cancelled":
        return "bg-rose-500"
      case "completed":
        return "bg-emerald-500"
    }
  }

  const getTypeColor = (type: Meeting["type"]) => {
    switch (type) {
      case "internal":
        return "bg-slate-500"
      case "external":
        return "bg-amber-500"
      case "personal":
        return "bg-purple-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{format(date, "MMMM yyyy", { locale: ptBR })}</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={date}
            onMonthChange={setDate}
            locale={ptBR}
            className="rounded-md"
            components={{
              DayContent: ({ date }) => {
                const meetingsOnDay = getMeetingsByDate(date)
                return (
                  <div className="w-full h-full flex flex-col items-center">
                    <div>{format(date, "d")}</div>
                    {meetingsOnDay.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {meetingsOnDay.length <= 3 ? (
                          meetingsOnDay.map((meeting, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${getStatusColor(meeting.status)}`} />
                          ))
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <div className="text-xs font-medium">+{meetingsOnDay.length - 2}</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
            </h3>
          </div>

          {meetingsOnSelectedDate.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma reunião agendada para esta data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetingsOnSelectedDate.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onMeetingClick(meeting)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium line-clamp-1">{meeting.title}</h4>
                    <Badge
                      variant="outline"
                      className={`${getTypeColor(meeting.type)} bg-opacity-10 border-opacity-20`}
                    >
                      {meeting.type === "internal" ? "Interna" : meeting.type === "external" ? "Externa" : "Pessoal"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatMeetingTime(meeting.startTime)} - {formatMeetingTime(meeting.endTime)}
                  </div>
                  {meeting.location && (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{meeting.location}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

