import CustomerPurchaseHistory from "@/app/components/HistoryConsummers"

 

interface HistoricoPageProps {
  params: {
    id: string
  }
}

export default function HistoricoPage({ params }: HistoricoPageProps) {
  // Em um cenário real, você buscaria os dados do cliente pelo ID
  const customerName = "Maria Silva" // Exemplo

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Histórico de Compras</h1>
      <p className="text-muted-foreground mb-6">Visualize todas as compras realizadas pelo cliente</p>

      <CustomerPurchaseHistory customerId={params.id} customerName={customerName} />
    </main>
  )
}

