"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CreateInvoiceFormProps {
  onInvoiceCreated: () => void
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function CreateInvoiceForm({ onInvoiceCreated }: CreateInvoiceFormProps) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    document: "",
  })

  const [invoiceDetails, setInvoiceDetails] = useState({
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    paymentMethod: "",
    notes: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0 }])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = () => {
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsSubmitting(false)
      onInvoiceCreated()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Informações do Cliente</h3>

          <div className="space-y-2">
            <Label htmlFor="customer-name">Nome do Cliente *</Label>
            <Input
              id="customer-name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-email">Email *</Label>
            <Input
              id="customer-email"
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-document">Documento (CPF/CNPJ)</Label>
            <Input
              id="customer-document"
              value={customer.document}
              onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Detalhes da Fatura</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-date">Data de Emissão *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal" id="issue-date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(invoiceDetails.issueDate, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDetails.issueDate}
                    onSelect={(date) => date && setInvoiceDetails({ ...invoiceDetails, issueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal" id="due-date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(invoiceDetails.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDetails.dueDate}
                    onSelect={(date) => date && setInvoiceDetails({ ...invoiceDetails, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de Pagamento</Label>
            <Select
              value={invoiceDetails.paymentMethod}
              onValueChange={(value) => setInvoiceDetails({ ...invoiceDetails, paymentMethod: value })}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Selecione um método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais para o cliente"
              value={invoiceDetails.notes}
              onChange={(e) => setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Itens da Fatura</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      placeholder="Descrição do item"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">R$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(calculateItemTotal(item))}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover item</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="font-bold">{formatCurrency(calculateTotal())}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onInvoiceCreated}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Fatura"}
        </Button>
      </div>
    </form>
  )
}

