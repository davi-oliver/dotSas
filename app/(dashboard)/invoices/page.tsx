import InvoiceManagement from "@/app/components/Invoice/invoice-managemente";


export default function InvoicesPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Gerenciamento de Faturas</h1>
      <p className="text-muted-foreground mb-6">Crie, envie e gerencie faturas e notas fiscais</p>

      <InvoiceManagement />
    </main>
  )
}

