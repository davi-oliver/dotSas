import CustomerPurchaseHistory from "@/app/components/HistoryConsummers"

 

interface HistoricoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function HistoricoPage({ params }: HistoricoPageProps) {
  // Em um cenário real, você buscaria os dados do cliente pelo ID
  const customerName = "Maria Silva" // Exemplo
  const paramsA = await params;

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Histórico de Compras</h1>
      <p className="text-muted-foreground mb-6">Visualize todas as compras realizadas pelo cliente</p>

      <CustomerPurchaseHistory customerId={paramsA.id} customerName={customerName} />
    </main>
  )
}

