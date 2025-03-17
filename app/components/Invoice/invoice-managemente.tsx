"use client"

import { useState } from "react"
 
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import InvoiceMetrics from "./invoice-metrics"
import CreateInvoiceForm from "./create-invoice-form"
import InvoiceList from "./invoice-list"

export default function InvoiceManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleInvoiceCreated = () => {
    setIsCreateDialogOpen(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <InvoiceMetrics refreshTrigger={refreshTrigger} />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Fatura</DialogTitle>
              <DialogDescription>Preencha os dados para gerar uma nova fatura</DialogDescription>
            </DialogHeader>
            <CreateInvoiceForm onInvoiceCreated={handleInvoiceCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <InvoiceList refreshTrigger={refreshTrigger} />
    </div>
  )
}

