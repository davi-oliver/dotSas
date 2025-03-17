"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data = [
  { name: "Jan", vendas: 18000, pedidos: 120, lucro: 4500 },
  { name: "Fev", vendas: 16000, pedidos: 105, lucro: 4000 },
  { name: "Mar", vendas: 21000, pedidos: 140, lucro: 5200 },
  { name: "Abr", vendas: 19500, pedidos: 130, lucro: 4800 },
  { name: "Mai", vendas: 22800, pedidos: 152, lucro: 5600 },
  { name: "Jun", vendas: 24000, pedidos: 160, lucro: 5900 },
  { name: "Jul", vendas: 24780, pedidos: 165, lucro: 6100 },
  { name: "Ago", vendas: 28000, pedidos: 187, lucro: 6800 },
  { name: "Set", vendas: 27000, pedidos: 180, lucro: 6600 },
  { name: "Out", vendas: 26000, pedidos: 173, lucro: 6300 },
  { name: "Nov", vendas: 31000, pedidos: 205, lucro: 7500 },
  { name: "Dez", vendas: 38000, pedidos: 253, lucro: 9200 },
]

interface SalesChartProps {
  className?: string
}

export default function SalesChart({ className }: SalesChartProps) {
  const [chartType, setChartType] = useState("line")
  const [dataType, setDataType] = useState("vendas")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getDataTypeLabel = () => {
    switch (dataType) {
      case "vendas":
        return "Vendas"
      case "pedidos":
        return "Pedidos"
      case "lucro":
        return "Lucro"
      default:
        return "Vendas"
    }
  }

  const getYAxisFormatter = () => {
    if (dataType === "vendas" || dataType === "lucro") {
      return (value: number) => `R$ ${value / 1000}k`
    }
    return (value: number) => value.toString()
  }

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value: any, index: number) => getYAxisFormatter()(value)} />
            <Tooltip
              formatter={(value: number) => (dataType === "pedidos" ? value : formatCurrency(value))}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataType}
              stroke="#6366F1"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name={getDataTypeLabel()}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={getYAxisFormatter()} />
          <Tooltip
            formatter={(value: number) => (dataType === "pedidos" ? value : formatCurrency(value))}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          <Bar dataKey={dataType} fill="#6366F1" name={getDataTypeLabel()} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Relatório de Vendas</CardTitle>
          <CardDescription>Análise de desempenho ao longo do tempo</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Tipo de dado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="pedidos">Pedidos</SelectItem>
              <SelectItem value="lucro">Lucro</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList className="grid w-[160px] grid-cols-2">
              <TabsTrigger value="line">Linha</TabsTrigger>
              <TabsTrigger value="bar">Barra</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}

