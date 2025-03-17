import ProductList from "@/app/components/ProductList";


export default function ProductsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Produtos</h1>
      <p className="text-muted-foreground mb-6">Gerencie seu catálogo de produtos</p>

      <ProductList />
    </main>
  )
}
