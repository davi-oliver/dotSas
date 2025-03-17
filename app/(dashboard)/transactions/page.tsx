import PaymentManagement from "@/app/components/Transactions/management";

 

export default function PaymentsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Gestão de Pagamentos</h1>
      <p className="text-muted-foreground mb-6">
        Gerencie transações, reembolsos, assinaturas e relatórios financeiros
      </p>

      <PaymentManagement />
    </main>
  )
}

