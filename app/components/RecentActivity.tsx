"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Clock, Package, User, CreditCard, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  type: "order" | "customer" | "payment" | "stock" | "alert"
  title: string
  description: string
  time: string
  status?: "success" | "pending" | "warning" | "error"
}

interface RecentActivitiesProps {
  className?: string
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "order":
      return <Package className="h-5 w-5" />
    case "customer":
      return <User className="h-5 w-5" />
    case "payment":
      return <CreditCard className="h-5 w-5" />
    case "stock":
      return <Package className="h-5 w-5" />
    case "alert":
      return <AlertCircle className="h-5 w-5" />
  }
}

const getStatusIcon = (status?: Activity["status"]) => {
  if (!status) return null

  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-amber-500" />
    case "warning":
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-rose-500" />
  }
}

const getStatusBadge = (status?: Activity["status"]) => {
  if (!status) return null

  switch (status) {
    case "success":
      return (
        <Badge variant="outline" className="text-emerald-500 border-emerald-500">
          Concluído
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Pendente
        </Badge>
      )
    case "warning":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Atenção
        </Badge>
      )
    case "error":
      return <Badge variant="destructive">Problema</Badge>
  }
}

const recentActivities: Activity[] = [
  {
    id: "ACT-001",
    type: "order",
    title: "Novo pedido #12345",
    description: "Cliente: João Silva - R$ 450,90",
    time: "Agora mesmo",
    status: "success",
  },
  {
    id: "ACT-002",
    type: "payment",
    title: "Pagamento recebido",
    description: "Pedido #12342 - R$ 189,99",
    time: "10 minutos atrás",
    status: "success",
  },
  {
    id: "ACT-003",
    type: "customer",
    title: "Novo cliente registrado",
    description: "Maria Oliveira criou uma conta",
    time: "25 minutos atrás",
  },
  {
    id: "ACT-004",
    type: "stock",
    title: "Alerta de estoque baixo",
    description: "Smartphone Galaxy S23 - 3 unidades",
    time: "1 hora atrás",
    status: "warning",
  },
  {
    id: "ACT-005",
    type: "order",
    title: "Pedido enviado",
    description: "Pedido #12336 foi despachado",
    time: "2 horas atrás",
    status: "success",
  },
  {
    id: "ACT-006",
    type: "payment",
    title: "Pagamento pendente",
    description: "Pedido #12341 - R$ 1.250,00",
    time: "3 horas atrás",
    status: "pending",
  },
  {
    id: "ACT-007",
    type: "alert",
    title: "Falha no processamento",
    description: "Pedido #12330 - Problema de pagamento",
    time: "5 horas atrás",
    status: "error",
  },
  {
    id: "ACT-008",
    type: "stock",
    title: "Produto sem estoque",
    description: "Notebook Ultrabook - Esgotado",
    time: "8 horas atrás",
    status: "error",
  },
]

export default function RecentActivities({ className }: RecentActivitiesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas ações e atualizações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    {activity.status && <div className="flex items-center">{getStatusBadge(activity.status)}</div>}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

