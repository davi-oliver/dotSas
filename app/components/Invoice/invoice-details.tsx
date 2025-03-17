"use client"

import { useState } from "react"  
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, FileText, Mail, Printer, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Invoice } from "./invoice-list"

interface InvoiceDetailsProps {
  invoice: Invoice | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: Invoice["status"]) => void
}

export default function InvoiceDetails({ 
  invoice, 
  isOpen, 
  onOpenChange,
  onStatusChange
}: InvoiceDetailsProps) {
  const [activeTab, setActiveTab] = useState("details")
  
  if (!invoice) return null
  
  
  
  if (!invoice) return null
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500"><AlertCircle className="mr-1 h-3 w-3" /> Pendente</Badge>
      case "paid":
        return <Badge className="bg-emerald-500"><CheckCircle2 className="mr-1 h-3 w-3" /> Paga</Badge>
      case "overdue":
        return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Vencida</Badge>
      case "cancelled":
        return <Badge variant="secondary"><X className="mr-1 h-3 w-3" /> Cancelada</Badge>
    }
  }
  
  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + item.total, 0)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Fatura {invoice.number}</span>
            {getStatusBadge(invoice.status)}
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a fatura
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Informações da Fatura</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Número:</div>
                    <div className="text-sm font-medium">{invoice.number}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Data de Emissão:</div>
                    <div className="text-sm">{invoice.issueDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Data de Vencimento:</div>
                    <div className="text-sm">{invoice.dueDate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <div className="text-sm">{getStatusBadge(invoice.status)}</div>
                  </div>
                  {invoice.paymentMethod && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Método de Pagamento:</div>
                      <div className="text-sm">{invoice.paymentMethod}</div>
                    </div>
                  )}
                  {invoice.transactionId && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">ID da Transação:</div>
                      <div className="text-sm">{invoice.transactionId}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Informações do Cliente</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Nome:</div>
                    <div className="text-sm font-medium">{invoice.customer.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Email:</div>
                    <div className="text-sm">{invoice.customer.email}</div>
                  </div>
                  {invoice.customer.document && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Documento:</div>
                      <div className="text-sm">{invoice.customer.document}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Itens da Fatura</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Preço Unitário</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(calculateTotal())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {invoice.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Observações</h3>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            <div className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">FATURA</h2>
                  <p className="text-muted-foreground">{invoice.number}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Sua Empresa Ltda.</p>
                  <p className="text-sm">Rua Exemplo, 123</p>
                  <p className="text-sm">São Paulo, SP - 01234-567</p>
                  <p className="text-sm">CNPJ: 12.345.678/0001-90</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-medium mb-2">Faturado para:</h3>
                  <p className="font-bold">{invoice.customer.name}</p>
                  <p className="text-sm">{invoice.customer.email}</p>
                  {invoice.customer.document && (
                    <p className="text-sm">Documento: {invoice.customer.document}</p>
                  )}
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium">Número da Fatura:</p>
                    <p className="text-sm">{invoice.number}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium">Data de Emissão:</p>
                    <p className="text-sm">{invoice.issueDate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium">Data de Vencimento:</p>
                    <p className="text-sm">{invoice.dueDate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm font-medium">Status:</p>
                    <div>{getStatusBadge(invoice.status)}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium mb-2">Itens:</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Qtd</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço Unit.</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50">
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">Total</td>
                        <td className="px-4 py-3 text-sm font-bold text-right">{formatCurrency(calculateTotal())}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mb-8">
                  <h3 className="font-medium mb-2">Observações:</h3>
                  <p className="text-sm border p-3 rounded-md bg-muted/20">{invoice.notes}</p>
                </div>
              )}
              
              <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t">
                <p>Obrigado por fazer negócios conosco!</p>
                <p>Para qualquer dúvida, entre em contato: financeiro@suaempresa.com.br</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Histórico da Fatura</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="min-w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fatura criada</p>
                    <p className="text-xs text-muted-foreground">15/07/2023 - 10:30</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="min-w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fatura enviada por email</p>
                    <p className="text-xs text-muted-foreground">15/07/2023 - 10:35</p>
                  </div>
                </div>
                
                {invoice.status === "paid" && (
                  <div className="flex items-start gap-4">
                    <div className="min-w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pagamento recebido</p>
                      <p className="text-xs text-muted-foreground">18/07/2023 - 14:22</p>
                      {invoice.transactionId && (
                        <p className="text-xs">Transação: {invoice.transactionId}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {invoice.status === "cancelled" && (
                  <div className="flex items-start gap-4">
                    <div className="min-w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <X className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fatura cancelada</p>
                      <p className="text-xs text-muted-foreground">16/07/2023 - 09:15</p>
                      <p className="text-xs">{invoice.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {invoice.status === "draft" && (
              <Button className="flex-1 sm:flex-none" onClick={() => onStatusChange(invoice.id, "pending")}>
                <FileText className="mr-2 h-4 w-4" />
                Finalizar e Emitir
              </Button>
            )}
            
            {invoice.status === "pending" && (
              <Button className="flex-1 sm:flex-none" onClick={() => onStatusChange(invoice.id, "paid")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Marcar como Paga
              </Button>
            )}
            
            {(invoice.status === "draft" || invoice.status === "pending") && (
              <Button variant="destructive" className="flex-1 sm:flex-none" onClick={() => onStatusChange(invoice.id, "cancelled")}>
                <X className="mr-2 h-4 w-4" />
                Cancelar Fatura
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

