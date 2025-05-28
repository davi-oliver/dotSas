"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDown, Download, Eye, Filter, Package, Search, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area" 
import { useMediaQuery } from "@/hooks/use-mobile"
import { DatePickerWithRange } from "./date-range-picker"
import { DateRange } from "react-day-picker"

// Tipos
type PurchaseStatus = "completed" | "processing" | "shipped" | "cancelled" | "returned"

interface PurchaseItem {
  id: string
  name: string
  quantity: number
  price: number
  imageUrl: string
}

interface Purchase {
  id: string
  date: Date
  total: number
  status: PurchaseStatus
  paymentMethod: string
  items: PurchaseItem[]
  trackingCode?: string
  invoice?: string
}

interface CustomerPurchaseHistoryProps {
  customerId: string
  customerName: string
}

// Dados de exemplo
const EXAMPLE_PURCHASES: Purchase[] = [
  {
    id: "ORD-2023-0001",
    date: new Date(2023, 11, 15),
    total: 1250.9,
    status: "completed",
    paymentMethod: "Cartão de Crédito",
    items: [
      {
        id: "PROD-001",
        name: "Smartphone Galaxy S23",
        quantity: 1,
        price: 1199.9,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "PROD-002",
        name: "Capa Protetora",
        quantity: 1,
        price: 51.0,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    trackingCode: "BR123456789",
    invoice: "NF-e 123456",
  },
  {
    id: "ORD-2023-0002",
    date: new Date(2023, 10, 3),
    total: 459.8,
    status: "shipped",
    paymentMethod: "Boleto Bancário",
    items: [
      {
        id: "PROD-003",
        name: "Tênis Esportivo",
        quantity: 1,
        price: 299.9,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "PROD-004",
        name: "Meias Esportivas (Pack com 3)",
        quantity: 2,
        price: 79.95,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    trackingCode: "BR987654321",
  },
  {
    id: "ORD-2023-0003",
    date: new Date(2023, 9, 20),
    total: 2599.0,
    status: "completed",
    paymentMethod: "PIX",
    items: [
      {
        id: "PROD-005",
        name: 'Notebook Ultrabook 14"',
        quantity: 1,
        price: 2599.0,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    invoice: "NF-e 123457",
  },
  {
    id: "ORD-2023-0004",
    date: new Date(2023, 8, 5),
    total: 149.9,
    status: "cancelled",
    paymentMethod: "Cartão de Crédito",
    items: [
      {
        id: "PROD-006",
        name: "Fones de Ouvido Bluetooth",
        quantity: 1,
        price: 149.9,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD-2023-0005",
    date: new Date(2023, 7, 12),
    total: 89.9,
    status: "returned",
    paymentMethod: "Cartão de Débito",
    items: [
      {
        id: "PROD-007",
        name: "Carregador Portátil",
        quantity: 1,
        price: 89.9,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD-2023-0006",
    date: new Date(2023, 6, 28),
    total: 1899.7,
    status: "completed",
    paymentMethod: "Cartão de Crédito (Parcelado)",
    items: [
      {
        id: "PROD-008",
        name: 'Smart TV 43"',
        quantity: 1,
        price: 1899.7,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    invoice: "NF-e 123458",
  },
  {
    id: "ORD-2023-0007",
    date: new Date(2023, 5, 15),
    total: 349.9,
    status: "completed",
    paymentMethod: "PIX",
    items: [
      {
        id: "PROD-009",
        name: "Cafeteira Elétrica",
        quantity: 1,
        price: 249.9,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "PROD-010",
        name: "Conjunto de Xícaras",
        quantity: 1,
        price: 100.0,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    invoice: "NF-e 123459",
  },
]

// Componente para exibir o status da compra
const PurchaseStatusBadge = ({ status }: { status: PurchaseStatus }) => {
  const statusConfig = {
    completed: { label: "Concluído", variant: "success" as const },
    processing: { label: "Em processamento", variant: "warning" as const },
    shipped: { label: "Enviado", variant: "info" as const },
    cancelled: { label: "Cancelado", variant: "destructive" as const },
    returned: { label: "Devolvido", variant: "outline" as const },
  }

  const config = statusConfig[status]

  return <Badge >{config.label}</Badge>
}

// Componente principal
export default function CustomerPurchaseHistory({ customerId, customerName }: CustomerPurchaseHistoryProps) {
  const [purchases, setPurchases] = useState<Purchase[]>(EXAMPLE_PURCHASES)
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(EXAMPLE_PURCHASES)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Função para aplicar filtros
  const applyFilters = () => {
    let result = [...purchases]

    // Filtro por termo de busca
    if (searchTerm) {
      result = result.filter(
        (purchase) =>
          purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtro por status
    if (statusFilter !== "all") {
      result = result.filter((purchase) => purchase.status === statusFilter)
    }

    // Filtro por data
    if (dateRange && dateRange.from) {
      result = result.filter((purchase) => purchase.date >= dateRange.from!)
    }

    if (dateRange && dateRange.to) {
      // Ajusta a data final para o final do dia
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter((purchase) => purchase.date <= endDate)
    }

    setFilteredPurchases(result)
    setIsFilterOpen(false)
  }

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateRange({ from: undefined, to: undefined })
    setFilteredPurchases(purchases)
    setIsFilterOpen(false)
  }

  // Função para formatar valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Componente de detalhes da compra para desktop
  const PurchaseDetailsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido {selectedPurchase?.id}</DialogTitle>
          <DialogDescription>
            Realizado em {selectedPurchase && format(selectedPurchase.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>
        <PurchaseDetailsContent />
      </DialogContent>
    </Dialog>
  )

  // Componente de detalhes da compra para mobile
  const PurchaseDetailsDrawer = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pedido {selectedPurchase?.id}</DrawerTitle>
          <DrawerDescription>
            Realizado em {selectedPurchase && format(selectedPurchase.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(80vh-10rem)] px-4">
          <PurchaseDetailsContent />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  // Conteúdo dos detalhes da compra
  const PurchaseDetailsContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <div className="mt-1">
            <PurchaseStatusBadge status={selectedPurchase?.status || "processing"} />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Forma de Pagamento</h4>
          <p className="mt-1">{selectedPurchase?.paymentMethod}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Total</h4>
          <p className="mt-1 font-medium">{selectedPurchase && formatCurrency(selectedPurchase.total)}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-3">Itens do Pedido</h4>
        <div className="space-y-4">
          {selectedPurchase?.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">{item.name}</h5>
                <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                <p className="mt-1 font-medium">{formatCurrency(item.price)} por unidade</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPurchase?.trackingCode && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Informações de Envio</h4>
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Código de Rastreio</p>
                <p className="font-medium">{selectedPurchase.trackingCode}</p>
              </div>
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Rastrear
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedPurchase?.invoice && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Nota Fiscal</h4>
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <p className="font-medium">{selectedPurchase.invoice}</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  // Componente de filtros para desktop
  const FiltersPopover = () => (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filtrar Compras</h4>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="processing">Em processamento</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="returned">Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <DatePickerWithRange date={dateRange} setDate={(date) => setDateRange(date)} />
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  // Componente de filtros para mobile
  const FiltersDrawer = () => (
    <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar Compras</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-mobile">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-mobile">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="processing">Em processamento</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="returned">Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={applyFilters}>Aplicar Filtros</Button>
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Histórico de Compras
        </CardTitle>
        <CardDescription>Visualize todas as compras realizadas por {customerName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por pedido ou produto..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => {
                    setSearchTerm("")
                    applyFilters()
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Limpar busca</span>
                </Button>
              )}
            </div>
            <div className="flex gap-2 self-end">
              {isMobile ? <FiltersDrawer /> : <FiltersPopover />}
              <Button variant="outline" size="sm" className="h-8" onClick={applyFilters}>
                Buscar
              </Button>
            </div>
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma compra encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">Não encontramos compras com os filtros selecionados.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              {/* Versão para desktop */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{format(purchase.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell>
                          <PurchaseStatusBadge status={purchase.status} />
                        </TableCell>
                        <TableCell>
                          {purchase.items.length === 1
                            ? purchase.items[0].name
                            : `${purchase.items[0].name} e mais ${purchase.items.length - 1} item(ns)`}
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(purchase.total)}</TableCell>
                        <TableCell>
                          <div onClick={() => setSelectedPurchase(purchase)}>
                            <PurchaseDetailsDialog />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Versão para mobile */}
              <div className="md:hidden space-y-4">
                {filteredPurchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{purchase.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(purchase.date, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <PurchaseStatusBadge status={purchase.status} />
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground">Itens:</p>
                      <p className="line-clamp-1">{purchase.items.map((item) => item.name).join(", ")}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-medium">{formatCurrency(purchase.total)}</p>
                      <div onClick={() => setSelectedPurchase(purchase)}>
                        <PurchaseDetailsDrawer />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredPurchases.length} de {purchases.length} compras
        </p>
      </CardFooter>
    </Card>
  )
}

