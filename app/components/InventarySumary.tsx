"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

interface InventorySummaryProps {
  className?: string
}

interface InventoryCategory {
  category: string
  inStock: number
  lowStock: number
  outOfStock: number
  total: number
}

export default function InventorySummary({ className }: InventorySummaryProps) {
  const [inventorySummary, setInventorySummary] = useState<InventoryCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setInventorySummary([
        {
          category: "Eletrônicos",
          inStock: 68,
          lowStock: 12,
          outOfStock: 5,
          total: 85,
        },
        {
          category: "Vestuário",
          inStock: 124,
          lowStock: 18,
          outOfStock: 8,
          total: 150,
        },
        {
          category: "Móveis",
          inStock: 32,
          lowStock: 6,
          outOfStock: 2,
          total: 40,
        },
        {
          category: "Acessórios",
          inStock: 45,
          lowStock: 10,
          outOfStock: 5,
          total: 60,
        },
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  const getTotalInventorySummary = () => {
    const total = {
      inStock: inventorySummary.reduce((acc, curr) => acc + curr.inStock, 0),
      lowStock: inventorySummary.reduce((acc, curr) => acc + curr.lowStock, 0),
      outOfStock: inventorySummary.reduce((acc, curr) => acc + curr.outOfStock, 0),
      total: inventorySummary.reduce((acc, curr) => acc + curr.total, 0),
    }

    return total
  }

  const total = getTotalInventorySummary()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resumo de Estoque</CardTitle>
        <CardDescription>Status atual do estoque por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Status Geral do Estoque</h4>
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Em Estoque: {total.inStock}
                </Badge>
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Baixo: {total.lowStock}
                </Badge>
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Esgotado: {total.outOfStock}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {inventorySummary.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{category.category}</h4>
                  <span className="text-sm text-muted-foreground">
                    {category.inStock} de {category.total} produtos
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Em estoque ({Math.round((category.inStock / category.total) * 100)}%)</span>
                    <span>{category.inStock}</span>
                  </div>
                  <Progress value={(category.inStock / category.total) * 100} className="h-2" />
                </div>
                {category.lowStock > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{category.lowStock} produtos com estoque baixo</span>
                  </div>
                )}
                {category.outOfStock > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-rose-500">
                    <XCircle className="h-3 w-3" />
                    <span>{category.outOfStock} produtos esgotados</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            <p>
              Recomendação: Considere reabastecer os {total.lowStock} produtos com estoque baixo para evitar itens
              esgotados.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

