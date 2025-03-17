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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Download, ExternalLink, Eye, Filter, MoreHorizontal, RefreshCcw, Search } from "lucide-react"

interface TransactionsTabProps {
  gateway: string
}

interface Transaction {
  id: string
  date: string
  customer: string
  amount: number
  status: "successful" | "pending" | "failed" | "refunded"
  paymentMethod: string
  gateway: string
}

export default function TransactionsTab({ gateway }: TransactionsTabProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    // Simulação de carregamento de dados
    const mockTransactions: Transaction[] = [
      {
        id: "TRX-12345",
        date: "2023-07-15 14:30",
        customer: "João Silva",
        amount: 299.9,
        status: "successful",
        paymentMethod: "credit_card",
        gateway: "stripe",
      },
      {
        id: "TRX-12346",
        date: "2023-07-15 15:45",
        customer: "Maria Oliveira",
        amount: 1250.0,
        status: "successful",
        paymentMethod: "pix",
        gateway: "pagseguro",
      },
      {
        id: "TRX-12347",
        date: "2023-07-14 09:20",
        customer: "Pedro Santos",
        amount: 89.9,
        status: "refunded",
        paymentMethod: "credit_card",
        gateway: "stripe",
      },
      {
        id: "TRX-12348",
        date: "2023-07-14 11:15",
        customer: "Ana Costa",
        amount: 450.5,
        status: "successful",
        paymentMethod: "boleto",
        gateway: "pagseguro",
      },
      {
        id: "TRX-12349",
        date: "2023-07-13 16:30",
        customer: "Carlos Ferreira",
        amount: 199.0,
        status: "pending",
        paymentMethod: "boleto",
        gateway: "pagseguro",
      },
      {
        id: "TRX-12350",
        date: "2023-07-13 10:45",
        customer: "Mariana Lima",
        amount: 1899.9,
        status: "successful",
        paymentMethod: "credit_card",
        gateway: "paypal",
      },
      {
        id: "TRX-12351",
        date: "2023-07-12 14:20",
        customer: "Rafael Souza",
        amount: 59.9,
        status: "failed",
        paymentMethod: "credit_card",
        gateway: "stripe",
      },
      {
        id: "TRX-12352",
        date: "2023-07-12 09:10",
        customer: "Juliana Alves",
        amount: 349.9,
        status: "successful",
        paymentMethod: "pix",
        gateway: "paypal",
      },
      {
        id: "TRX-12353",
        date: "2023-07-11 17:30",
        customer: "Fernando Gomes",
        amount: 129.9,
        status: "successful",
        paymentMethod: "credit_card",
        gateway: "stripe",
      },
      {
        id: "TRX-12354",
        date: "2023-07-11 13:45",
        customer: "Camila Rodrigues",
        amount: 799.9,
        status: "pending",
        paymentMethod: "boleto",
        gateway: "pagseguro",
      },
      {
        id: "TRX-12355",
        date: "2023-07-10 11:20",
        customer: "Lucas Martins",
        amount: 149.9,
        status: "successful",
        paymentMethod: "credit_card",
        gateway: "paypal",
      },
      {
        id: "TRX-12356",
        date: "2023-07-10 10:15",
        customer: "Amanda Pereira",
        amount: 499.9,
        status: "refunded",
        paymentMethod: "credit_card",
        gateway: "stripe",
      },
    ]

    setTransactions(mockTransactions)
    setFilteredTransactions(mockTransactions)
  }, [])

  useEffect(() => {
    let result = [...transactions]

    // Filtrar por gateway
    if (gateway !== "all") {
      result = result.filter((transaction) => transaction.gateway === gateway)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter((transaction) => transaction.status === statusFilter)
    }

    // Filtrar por método de pagamento
    if (paymentMethodFilter !== "all") {
      result = result.filter((transaction) => transaction.paymentMethod === paymentMethodFilter)
    }

    setFilteredTransactions(result)
    setCurrentPage(1)
  }, [transactions, searchTerm, statusFilter, paymentMethodFilter, gateway])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "debit_card":
        return "Cartão de Débito"
      case "boleto":
        return "Boleto"
      case "pix":
        return "PIX"
      default:
        return method
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "successful":
        return <Badge className="bg-emerald-500">Aprovado</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pendente
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Falha</Badge>
      case "refunded":
        return <Badge variant="secondary">Reembolsado</Badge>
    }
  }

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>Gerencie todas as transações de pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por ID ou cliente..."
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
                  <SelectItem value="successful">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="failed">Falhas</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Método de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
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
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{formatPaymentMethod(transaction.paymentMethod)}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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
                                setSelectedTransaction(transaction)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver no Gateway
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {transaction.status === "successful" && (
                              <DropdownMenuItem>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Solicitar Reembolso
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Baixar Comprovante
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber: number

                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault()
                          setCurrentPage(pageNumber)
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault()
                          setCurrentPage(totalPages)
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Transação</DialogTitle>
              <DialogDescription>Informações completas sobre a transação</DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ID da Transação</h4>
                    <p className="font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div>{getStatusBadge(selectedTransaction.status)}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                  <p>{selectedTransaction.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Valor</h4>
                    <p className="font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Data</h4>
                    <p>{selectedTransaction.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Método de Pagamento</h4>
                    <p>{formatPaymentMethod(selectedTransaction.paymentMethod)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gateway</h4>
                    <p className="capitalize">{selectedTransaction.gateway}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Comprovante
                  </Button>

                  {selectedTransaction.status === "successful" && (
                    <Button variant="outline" size="sm">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reembolsar
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

