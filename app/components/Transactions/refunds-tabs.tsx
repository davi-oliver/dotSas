"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Clock, Download, Eye, Filter, Search, XCircle } from "lucide-react"

interface RefundsTabProps {
  gateway: string
}

interface Refund {
  id: string
  transactionId: string
  date: string
  customer: string
  amount: number
  status: "approved" | "pending" | "rejected"
  reason: string
  gateway: string
}

export default function RefundsTab({ gateway }: RefundsTabProps) {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewRefundOpen, setIsNewRefundOpen] = useState(false)
  const [newRefund, setNewRefund] = useState({
    transactionId: "",
    amount: "",
    reason: "",
  })

  useEffect(() => {
    // Simulação de carregamento de dados
    const mockRefunds: Refund[] = [
      {
        id: "REF-001",
        transactionId: "TRX-12347",
        date: "2023-07-14 15:30",
        customer: "Pedro Santos",
        amount: 89.9,
        status: "approved",
        reason: "Cliente solicitou cancelamento",
        gateway: "stripe",
      },
      {
        id: "REF-002",
        transactionId: "TRX-12356",
        date: "2023-07-10 14:20",
        customer: "Amanda Pereira",
        amount: 499.9,
        status: "approved",
        reason: "Produto com defeito",
        gateway: "stripe",
      },
      {
        id: "REF-003",
        transactionId: "TRX-12340",
        date: "2023-07-08 09:15",
        customer: "Roberto Almeida",
        amount: 129.9,
        status: "pending",
        reason: "Produto não recebido",
        gateway: "paypal",
      },
      {
        id: "REF-004",
        transactionId: "TRX-12335",
        date: "2023-07-05 16:45",
        customer: "Fernanda Costa",
        amount: 349.9,
        status: "rejected",
        reason: "Fora do prazo de devolução",
        gateway: "pagseguro",
      },
      {
        id: "REF-005",
        transactionId: "TRX-12330",
        date: "2023-07-03 11:20",
        customer: "Marcelo Silva",
        amount: 199.9,
        status: "approved",
        reason: "Produto diferente do anunciado",
        gateway: "paypal",
      },
      {
        id: "REF-006",
        transactionId: "TRX-12325",
        date: "2023-07-01 10:10",
        customer: "Carla Oliveira",
        amount: 89.9,
        status: "pending",
        reason: "Cliente desistiu da compra",
        gateway: "stripe",
      },
    ]

    setRefunds(mockRefunds)
    setFilteredRefunds(mockRefunds)
  }, [])

  useEffect(() => {
    let result = [...refunds]

    // Filtrar por gateway
    if (gateway !== "all") {
      result = result.filter((refund) => refund.gateway === gateway)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (refund) =>
          refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.customer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter((refund) => refund.status === statusFilter)
    }

    setFilteredRefunds(result)
  }, [refunds, searchTerm, statusFilter, gateway])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusBadge = (status: Refund["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Aprovado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="mr-1 h-3 w-3" /> Pendente
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejeitado
          </Badge>
        )
    }
  }

  const handleCreateRefund = () => {
    // Simulação de criação de reembolso
    const newRefundObj: Refund = {
      id: `REF-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      transactionId: newRefund.transactionId,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      customer: "Cliente Exemplo",
      amount: Number.parseFloat(newRefund.amount),
      status: "pending",
      reason: newRefund.reason,
      gateway: gateway !== "all" ? gateway : "stripe",
    }

    setRefunds([newRefundObj, ...refunds])
    setIsNewRefundOpen(false)
    setNewRefund({
      transactionId: "",
      amount: "",
      reason: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Reembolsos</CardTitle>
            <CardDescription>Gerencie solicitações de reembolso e devoluções</CardDescription>
          </div>
          <Dialog open={isNewRefundOpen} onOpenChange={setIsNewRefundOpen}>
            <DialogTrigger asChild>
              <Button>Novo Reembolso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar Reembolso</DialogTitle>
                <DialogDescription>Preencha os dados para processar um novo reembolso</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="transaction-id" className="text-sm font-medium">
                    ID da Transação
                  </label>
                  <Input
                    id="transaction-id"
                    placeholder="Ex: TRX-12345"
                    value={newRefund.transactionId}
                    onChange={(e) => setNewRefund({ ...newRefund, transactionId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Valor do Reembolso
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">R$</span>
                    <Input
                      id="amount"
                      className="pl-10"
                      placeholder="0,00"
                      value={newRefund.amount}
                      onChange={(e) => setNewRefund({ ...newRefund, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Motivo do Reembolso
                  </label>
                  <Select
                    onValueChange={(value) => setNewRefund({ ...newRefund, reason: value })}
                    value={newRefund.reason}
                  >
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Selecione um motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produto com defeito">Produto com defeito</SelectItem>
                      <SelectItem value="Cliente solicitou cancelamento">Cliente solicitou cancelamento</SelectItem>
                      <SelectItem value="Produto não recebido">Produto não recebido</SelectItem>
                      <SelectItem value="Produto diferente do anunciado">Produto diferente do anunciado</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>

                  {newRefund.reason === "Outro" && (
                    <Textarea
                      placeholder="Descreva o motivo do reembolso..."
                      className="mt-2"
                      onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewRefundOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateRefund}>Solicitar Reembolso</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar reembolsos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
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
                  <TableHead>Transação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum reembolso encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.transactionId}</TableCell>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell>{formatCurrency(refund.amount)}</TableCell>
                      <TableCell>{getStatusBadge(refund.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRefund(refund)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver Detalhes</span>
                        </Button>
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
              <DialogTitle>Detalhes do Reembolso</DialogTitle>
              <DialogDescription>Informações completas sobre o reembolso</DialogDescription>
            </DialogHeader>

            {selectedRefund && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ID do Reembolso</h4>
                    <p className="font-medium">{selectedRefund.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div>{getStatusBadge(selectedRefund.status)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Transação Original</h4>
                  <p>{selectedRefund.transactionId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                    <p>{selectedRefund.customer}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Data</h4>
                    <p>{selectedRefund.date}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Valor Reembolsado</h4>
                  <p className="font-medium">{formatCurrency(selectedRefund.amount)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Motivo</h4>
                  <p>{selectedRefund.reason}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Gateway</h4>
                  <p className="capitalize">{selectedRefund.gateway}</p>
                </div>

                {selectedRefund.status === "pending" && (
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeitar
                    </Button>
                    <Button size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}


