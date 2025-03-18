import ProductList from "@/app/components/Products/ProductList";
import { createClient } from "@/utils/supabase/server";
import { getAllCategory, getAllProducts } from "../(modules)/(hook)/use-product";



export default async function ProductsPage() {
   
  const gettAllProducts = await getAllProducts()
  const categories = await getAllCategory()


   

 




  


  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Produtos</h1>
      <p className="text-muted-foreground mb-6">Gerencie seu catálogo de produtos</p>

      <ProductList items={gettAllProducts} categories={categories} />
    </main>
  )
}
