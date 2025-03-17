"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductsPerformanceProps {
  className?: string
}

interface Product {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  profit: number
  growth: number
}

const categoryData = [
  { name: "Eletrônicos", value: 38 },
  { name: "Vestuário", value: 25 },
  { name: "Alimentos", value: 15 },
  { name: "Móveis", value: 12 },
  { name: "Outros", value: 10 },
]

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F59E0B"]

export default function ProductsPerformance({ className }: ProductsPerformanceProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [sortColumn, setSortColumn] = useState<string>("revenue")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"product" | "category">("product")

  useEffect(() => {
    setProducts([
      {
        id: "PROD-001",
        name: "Smartphone Galaxy S23",
        category: "Eletrônicos",
        sales: 48,
        revenue: 239900,
        profit: 59975,
        growth: 12.5,
      },
      {
        id: "PROD-002",
        name: "Notebook Ultrabook 14",
        category: "Eletrônicos",
        sales: 36,
        revenue: 215964,
        profit: 53991,
        growth: 8.2,
      },
      {
        id: "PROD-003",
        name: "Tênis Esportivo",
        category: "Vestuário",
        sales: 94,
        revenue: 28191,
        profit: 11276,
        growth: 15.7,
      },
      {
        id: "PROD-004",
        name: "Cafeteira Elétrica",
        category: "Eletrodomésticos",
        sales: 52,
        revenue: 12995,
        profit: 5198,
        growth: -2.3,
      },
      {
        id: "PROD-005",
        name: "Smart TV 43",
        category: "Eletrônicos",
        sales: 28,
        revenue: 67172,
        profit: 16793,
        growth: 5.9,
      },
    ])
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100)
  }

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const aValue = a[sortColumn as keyof Product]
      const bValue = b[sortColumn as keyof Product]

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null

    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Desempenho de Produtos</CardTitle>
          <CardDescription>Análise dos produtos mais vendidos e suas categorias</CardDescription>
        </div>
        <Select value={viewMode} onValueChange={(value: "product" | "category") => setViewMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Por Produto</SelectItem>
            <SelectItem value="category">Por Categoria</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {viewMode === "product" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("sales")}>
                  <div className="flex items-center">
                    Vendas
                    <SortIcon column="sales" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("revenue")}>
                  <div className="flex items-center justify-end">
                    Receita
                    <SortIcon column="revenue" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("profit")}>
                  <div className="flex items-center justify-end">
                    Lucro
                    <SortIcon column="profit" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("growth")}>
                  <div className="flex items-center justify-end">
                    Crescimento
                    <SortIcon column="growth" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortProducts(products).map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.profit)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.growth >= 0 ? "default" : "destructive"}>
                      {product.growth >= 0 ? "+" : ""}
                      {product.growth}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Distribuição por Categoria</h4>
                <p className="text-sm text-muted-foreground">
                  Eletrônicos representam a maior parte das vendas, seguido por vestuário.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Oportunidades de Crescimento</h4>
                <p className="text-sm text-muted-foreground">
                  Categorias como Móveis e Alimentos apresentam potencial para expansão.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

