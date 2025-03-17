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
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Printer,
  Search,
  X,
} from "lucide-react"
import InvoiceDetails from "./invoice-details"
 

interface InvoiceListProps {
  refreshTrigger?: number
}

export interface Invoice {
  id: string
  number: string
  customer: {
    name: string
    email: string
    document?: string
  }
  issueDate: string
  dueDate: string
  amount: number
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  notes?: string
  paymentMethod?: string
  transactionId?: string
}

export default function InvoiceList({ refreshTrigger }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    // Simulação de carregamento de dados
    const mockInvoices: Invoice[] = [
      {
        id: "INV-2023-0001",
        number: "NF-e 12345",
        customer: {
          name: "João Silva",
          email: "joao.silva@example.com",
          document: "123.456.789-00",
        },
        issueDate: "2023-07-15",
        dueDate: "2023-08-15",
        amount: 1250.9,
        status: "pending",
        items: [
          {
            description: "Smartphone Galaxy S23",
            quantity: 1,
            unitPrice: 1199.9,
            total: 1199.9,
          },
          {
            description: "Capa Protetora",
            quantity: 1,
            unitPrice: 51.0,
            total: 51.0,
          },
        ],
        notes: "Pagamento em 30 dias",
        paymentMethod: "Boleto Bancário",
      },
      {
        id: "INV-2023-0002",
        number: "NF-e 12346",
        customer: {
          name: "Maria Oliveira",
          email: "maria.oliveira@example.com",
          document: "987.654.321-00",
        },
        issueDate: "2023-07-10",
        dueDate: "2023-07-25",
        amount: 459.8,
        status: "paid",
        items: [
          {
            description: "Tênis Esportivo",
            quantity: 1,
            unitPrice: 299.9,
            total: 299.9,
          },
          {
            description: "Meias Esportivas (Pack com 3)",
            quantity: 2,
            unitPrice: 79.95,
            total: 159.9,
          },
        ],
        transactionId: "TRX-12346",
      },
      {
        id: "INV-2023-0003",
        number: "NF-e 12347",
        customer: {
          name: "Pedro Santos",
          email: "pedro.santos@example.com",
          document: "456.789.123-00",
        },
        issueDate: "2023-07-05",
        dueDate: "2023-07-05",
        amount: 2599.0,
        status: "paid",
        items: [
          {
            description: 'Notebook Ultrabook 14"',
            quantity: 1,
            unitPrice: 2599.0,
            total: 2599.0,
          },
        ],
        transactionId: "TRX-12347",
      },
      {
        id: "INV-2023-0004",
        number: "NF-e 12348",
        customer: {
          name: "Ana Costa",
          email: "ana.costa@example.com",
          document: "789.123.456-00",
        },
        issueDate: "2023-06-25",
        dueDate: "2023-07-10",
        amount: 149.9,
        status: "overdue",
        items: [
          {
            description: "Fones de Ouvido Bluetooth",
            quantity: 1,
            unitPrice: 149.9,
            total: 149.9,
          },
        ],
      },
      {
        id: "INV-2023-0005",
        number: "NF-e 12349",
        customer: {
          name: "Carlos Ferreira",
          email: "carlos.ferreira@example.com",
          document: "321.654.987-00",
        },
        issueDate: "2023-06-20",
        dueDate: "2023-07-05",
        amount: 89.9,
        status: "cancelled",
        items: [
          {
            description: "Carregador Portátil",
            quantity: 1,
            unitPrice: 89.9,
            total: 89.9,
          },
        ],
        notes: "Cancelado a pedido do cliente",
      },
      {
        id: "INV-2023-0006",
        number: "NF-e 12350",
        customer: {
          name: "Mariana Lima",
          email: "mariana.lima@example.com",
          document: "654.987.321-00",
        },
        issueDate: "2023-07-18",
        dueDate: "2023-08-18",
        amount: 1899.7,
        status: "draft",
        items: [
          {
            description: 'Smart TV 43"',
            quantity: 1,
            unitPrice: 1899.7,
            total: 1899.7,
          },
        ],
        notes: "Aguardando confirmação do cliente",
      },
      {
        id: "INV-2023-0007",
        number: "NF-e 12351",
        customer: {
          name: "Rafael Souza",
          email: "rafael.souza@example.com",
          document: "159.753.852-00",
        },
        issueDate: "2023-07-12",
        dueDate: "2023-07-27",
        amount: 349.9,
        status: "pending",
        items: [
          {
            description: "Cafeteira Elétrica",
            quantity: 1,
            unitPrice: 249.9,
            total: 249.9,
          },
          {
            description: "Conjunto de Xícaras",
            quantity: 1,
            unitPrice: 100.0,
            total: 100.0,
          },
        ],
        paymentMethod: "Cartão de Crédito",
      },
      {
        id: "INV-2023-0008",
        number: "NF-e 12352",
        customer: {
          name: "Juliana Alves",
          email: "juliana.alves@example.com",
          document: "753.159.852-00",
        },
        issueDate: "2023-07-08",
        dueDate: "2023-07-23",
        amount: 799.9,
        status: "paid",
        items: [
          {
            description: "Cadeira de Escritório",
            quantity: 1,
            unitPrice: 799.9,
            total: 799.9,
          },
        ],
        transactionId: "TRX-12352",
      },
    ]

    setInvoices(mockInvoices)
    setFilteredInvoices(mockInvoices)
  }, [refreshTrigger])

  useEffect(() => {
    let result = [...invoices]

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(result)
    setCurrentPage(1)
  }, [invoices, searchTerm, statusFilter])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="mr-1 h-3 w-3" /> Pendente
          </Badge>
        )
      case "paid":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Paga
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" /> Vencida
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary">
            <X className="mr-1 h-3 w-3" /> Cancelada
          </Badge>
        )
    }
  }

  const handleUpdateInvoiceStatus = (id: string, newStatus: Invoice["status"]) => {
    setInvoices(invoices.map((invoice) => (invoice.id === id ? { ...invoice, status: newStatus } : invoice)))

    if (selectedInvoice?.id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus })
    }
  }

  // Paginação
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
        <CardDescription>Gerencie todas as faturas e notas fiscais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar faturas..."
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
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Paga</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
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
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma fatura encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.customer.name}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                                setSelectedInvoice(invoice)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Baixar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar por Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.status === "draft" && (
                              <DropdownMenuItem onClick={() => handleUpdateInvoiceStatus(invoice.id, "pending")}>
                                <FileText className="mr-2 h-4 w-4" />
                                Finalizar e Emitir
                              </DropdownMenuItem>
                            )}
                            {invoice.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleUpdateInvoiceStatus(invoice.id, "paid")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marcar como Paga
                              </DropdownMenuItem>
                            )}
                            {(invoice.status === "draft" || invoice.status === "pending") && (
                              <DropdownMenuItem onClick={() => handleUpdateInvoiceStatus(invoice.id, "cancelled")}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar Fatura
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

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
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
                        onClick={(e) => {
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
                        onClick={(e) => {
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
                    onClick={(e) => {
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

        <InvoiceDetails
          invoice={selectedInvoice}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onStatusChange={handleUpdateInvoiceStatus}
        />
      </CardContent>
    </Card>
  )
}

