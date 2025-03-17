"use client"

import { useState } from "react"
import type { Meeting, Participant } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Clock } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface CreateMeetingFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (meeting: Meeting) => void
  editMeeting?: Meeting
}

// Esquema de validação do formulário
const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().optional(),
  date: z.date({
    required_error: "A data da reunião é obrigatória.",
  }),
  startTime: z.string({
    required_error: "O horário de início é obrigatório.",
  }),
  endTime: z.string({
    required_error: "O horário de término é obrigatório.",
  }),
  location: z.string().optional(),
  meetingUrl: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
  type: z.enum(["internal", "external", "personal"], {
    required_error: "O tipo de reunião é obrigatório.",
  }),
  recurrence: z
    .enum(["none", "daily", "weekly", "monthly"], {
      required_error: "A recorrência é obrigatória.",
    })
    .default("none"),
})

export default function CreateMeetingForm({ isOpen, onOpenChange, onSubmit, editMeeting }: CreateMeetingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editMeeting
      ? {
          title: editMeeting.title,
          description: editMeeting.description || "",
          date: new Date(editMeeting.startTime),
          startTime: format(new Date(editMeeting.startTime), "HH:mm"),
          endTime: format(new Date(editMeeting.endTime), "HH:mm"),
          location: editMeeting.location || "",
          meetingUrl: editMeeting.meetingUrl || "",
          type: editMeeting.type,
          recurrence: editMeeting.recurrence || "none",
        }
      : {
          title: "",
          description: "",
          date: new Date(),
          startTime: "09:00",
          endTime: "10:00",
          location: "",
          meetingUrl: "",
          type: "internal",
          recurrence: "none",
        },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Criar objeto de data para horário de início
      const [startHour, startMinute] = values.startTime.split(":").map(Number)
      const startTime = new Date(values.date)
      startTime.setHours(startHour, startMinute, 0)

      // Criar objeto de data para horário de término
      const [endHour, endMinute] = values.endTime.split(":").map(Number)
      const endTime = new Date(values.date)
      endTime.setHours(endHour, endMinute, 0)

      // Dados do usuário atual (simulado)
      const currentUser: Participant = {
        id: "p1",
        name: "Carlos Oliveira",
        email: "carlos@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
        isCurrentUser: true,
      }

      // Criar objeto de reunião
      const meeting: Meeting = {
        id: editMeeting?.id || uuidv4(),
        title: values.title,
        description: values.description,
        startTime,
        endTime,
        location: values.location,
        meetingUrl: values.meetingUrl || undefined,
        type: values.type,
        status: editMeeting?.status || "scheduled",
        recurrence: values.recurrence === "none" ? undefined : values.recurrence,
        organizer: editMeeting?.organizer || currentUser,
        participants: editMeeting?.participants || [currentUser],
      }

      onSubmit(meeting)
    } catch (error) {
      console.error("Erro ao criar reunião:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMeeting ? "Editar Reunião" : "Nova Reunião"}</DialogTitle>
          <DialogDescription>
            {editMeeting
              ? "Edite os detalhes da reunião existente."
              : "Preencha os detalhes para agendar uma nova reunião."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da reunião" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo da reunião"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                            {field.value ? (
                              format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Término</FormLabel>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Local da reunião" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Reunião</FormLabel>
                    <FormControl>
                      <Input placeholder="https://meet.example.com/..." {...field} />
                    </FormControl>
                    <FormDescription>Para reuniões online (opcional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">Interna</SelectItem>
                        <SelectItem value="external">Externa</SelectItem>
                        <SelectItem value="personal">Pessoal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recorrência</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a recorrência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sem recorrência</SelectItem>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : editMeeting ? "Salvar alterações" : "Criar reunião"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

