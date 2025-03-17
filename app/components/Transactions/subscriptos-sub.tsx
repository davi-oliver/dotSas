"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react"

interface SubscriptionsTabProps {
  gateway: string
}

interface Subscription {
  id: string
  customer: string
  plan: string
  amount: number
  status: "active" | "paused" | "cancelled" | "past_due"
  startDate: string
  nextBillingDate: string
  gateway: string
  billingCycle: "monthly" | "quarterly" | "yearly"
}

export default function SubscriptionsTab({ gateway }: SubscriptionsTabProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    const mockSubscriptions: Subscription[] = [
      {
        id: "SUB-001",
        customer: "João Silva",
        plan: "Plano Premium",
        amount: 49.9,
        status: "active",
        startDate: "2023-01-15",
        nextBillingDate: "2023-08-15",
        gateway: "stripe",
        billingCycle: "monthly",
      },
      {
        id: "SUB-002",
        customer: "Maria Oliveira",
        plan: "Plano Básico",
        amount: 29.9,
        status: "active",
        startDate: "2023-02-10",
        nextBillingDate: "2023-08-10",
        gateway: "paypal",
        billingCycle: "monthly",
      },
      {
        id: "SUB-003",
        customer: "Pedro Santos",
        plan: "Plano Empresarial",
        amount: 199.9,
        status: "paused",
        startDate: "2023-03-05",
        nextBillingDate: "2023-09-05",
        gateway: "stripe",
        billingCycle: "monthly",
      },
      {
        id: "SUB-004",
        customer: "Ana Costa",
        plan: "Plano Premium",
        amount: 49.9,
        status: "cancelled",
        startDate: "2023-01-20",
        nextBillingDate: "2023-07-20",
        gateway: "pagseguro",
        billingCycle: "monthly",
      },
      {
        id: "SUB-005",
        customer: "Carlos Ferreira",
        plan: "Plano Empresarial",
        amount: 539.7,
        status: "active",
        startDate: "2023-04-15",
        nextBillingDate: "2023-10-15",
        gateway: "stripe",
        billingCycle: "quarterly",
      },
      {
        id: "SUB-006",
        customer: "Mariana Lima",
        plan: "Plano Básico",
        amount: 29.9,
        status: "past_due",
        startDate: "2023-05-10",
        nextBillingDate: "2023-07-10",
        gateway: "paypal",
        billingCycle: "monthly",
      },
      {
        id: "SUB-007",
        customer: "Rafael Souza",
        plan: "Plano Premium Anual",
        amount: 479.0,
        status: "active",
        startDate: "2023-01-05",
        nextBillingDate: "2024-01-05",
        gateway: "stripe",
        billingCycle: "yearly",
      },
    ]

    setSubscriptions(mockSubscriptions)
    setFilteredSubscriptions(mockSubscriptions)
  }, [])

  useEffect(() => {
    let result = [...subscriptions]

    // Filtrar por gateway
    if (gateway !== "all") {
      result = result.filter((subscription) => subscription.gateway === gateway)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter((subscription) => subscription.status === statusFilter)
    }

    setFilteredSubscriptions(result)
  }, [subscriptions, searchTerm, statusFilter, gateway])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatBillingCycle = (cycle: Subscription["billingCycle"]) => {
    switch (cycle) {
      case "monthly":
        return "Mensal"
      case "quarterly":
        return "Trimestral"
      case "yearly":
        return "Anual"
      default:
        return cycle
    }
  }

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Ativa
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <PauseCircle className="mr-1 h-3 w-3" /> Pausada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" /> Cancelada
          </Badge>
        )
      case "past_due":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" /> Pagamento Atrasado
          </Badge>
        )
    }
  }

  const handleUpdateSubscriptionStatus = (id: string, newStatus: Subscription["status"]) => {
    setSubscriptions(
      subscriptions.map((subscription) =>
        subscription.id === id ? { ...subscription, status: newStatus } : subscription,
      ),
    )

    if (selectedSubscription?.id === id) {
      setSelectedSubscription({ ...selectedSubscription, status: newStatus })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assinaturas</CardTitle>
        <CardDescription>Gerencie cobranças recorrentes e assinaturas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar assinaturas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="paused">Pausadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="past_due">Pagamento Atrasado</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Próxima Cobrança</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhuma assinatura encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.id}</TableCell>
                      <TableCell>{subscription.customer}</TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{formatCurrency(subscription.amount)}</TableCell>
                      <TableCell>{formatBillingCycle(subscription.billingCycle)}</TableCell>
                      <TableCell>{subscription.nextBillingDate}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSubscription(subscription)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {subscription.status === "active" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateSubscriptionStatus(subscription.id, "paused")}
                              >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                Pausar Assinatura
                              </DropdownMenuItem>
                            )}
                            {subscription.status === "paused" && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateSubscriptionStatus(subscription.id, "active")}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Reativar Assinatura
                              </DropdownMenuItem>
                            )}
                            {(subscription.status === "active" || subscription.status === "paused") && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateSubscriptionStatus(subscription.id, "cancelled")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar Assinatura
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Assinatura</DialogTitle>
              <DialogDescription>Informações completas sobre a assinatura</DialogDescription>
            </DialogHeader>

            {selectedSubscription && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ID da Assinatura</h4>
                    <p className="font-medium">{selectedSubscription.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div>{getStatusBadge(selectedSubscription.status)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                  <p>{selectedSubscription.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Plano</h4>
                    <p>{selectedSubscription.plan}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Ciclo de Cobrança</h4>
                    <p>{formatBillingCycle(selectedSubscription.billingCycle)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Valor</h4>
                    <p className="font-medium">{formatCurrency(selectedSubscription.amount)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gateway</h4>
                    <p className="capitalize">{selectedSubscription.gateway}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Data de Início</h4>
                    <p>{selectedSubscription.startDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Próxima Cobrança</h4>
                    <p>{selectedSubscription.nextBillingDate}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  {selectedSubscription.status === "active" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, "paused")}
                      >
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Pausar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, "cancelled")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {selectedSubscription.status === "paused" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, "active")}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Reativar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, "cancelled")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {selectedSubscription.status === "past_due" && (
                    <Button className="w-full" size="sm">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Tentar Cobrança Novamente
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

