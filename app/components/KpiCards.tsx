"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, CircleDollarSign, PieChart, ShoppingBag, ShoppingCart } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: number
  trendLabel: string
  className?: string
}

function KpiCard({ title, value, description, icon, trend, trendLabel, className }: KpiCardProps) {
  const isPositive = trend >= 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <span className={`flex items-center ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
            {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-muted-foreground ml-2">{trendLabel}</span>
        </div>
        <CardDescription className="pt-3">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default function KpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Receita Total"
        value="R$ 24.780,00"
        description="A receita está crescendo consistentemente nos últimos meses."
        icon={<CircleDollarSign className="h-4 w-4 text-primary" />}
        trend={12.5}
        trendLabel="vs. mês anterior"
      />
      <KpiCard
        title="Vendas"
        value="192"
        description="O número de pedidos aumentou em relação ao período anterior."
        icon={<ShoppingBag className="h-4 w-4 text-primary" />}
        trend={8.2}
        trendLabel="vs. mês anterior"
      />
      <KpiCard
        title="Ticket Médio"
        value="R$ 129,06"
        description="O valor médio por pedido teve um leve aumento."
        icon={<ShoppingCart className="h-4 w-4 text-primary" />}
        trend={4.3}
        trendLabel="vs. mês anterior"
      />
      <KpiCard
        title="Taxa de Conversão"
        value="3.2%"
        description="A taxa de conversão está abaixo da meta mensal de 3.5%."
        icon={<PieChart className="h-4 w-4 text-primary" />}
        trend={-0.3}
        trendLabel="vs. meta"
      />
    </div>
  )
}

