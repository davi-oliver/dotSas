"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, ShoppingBag, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  changeValue: number
  icon: React.ReactNode
}

function MetricCard({ title, value, description, changeValue, icon }: MetricCardProps) {
  const isPositive = changeValue >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </span>
          <p className={`text-xs ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
            {isPositive ? "+" : ""}
            {changeValue}%
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState([
    {
      title: "Vendas Totais",
      value: "R$ 0",
      description: "comparado ao mês anterior",
      changeValue: 0,
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Pedidos",
      value: "0",
      description: "comparado ao mês anterior",
      changeValue: 0,
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Clientes",
      value: "0",
      description: "novos clientes",
      changeValue: 0,
      icon: <Users className="h-4 w-4" />,
    },
  ])

  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setMetrics([
        {
          title: "Vendas Totais",
          value: "R$ 24.780,00",
          description: "comparado ao mês anterior",
          changeValue: 12.5,
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          title: "Pedidos",
          value: "192",
          description: "comparado ao mês anterior",
          changeValue: 8.2,
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          title: "Clientes",
          value: "45",
          description: "novos clientes",
          changeValue: -2.3,
          icon: <Users className="h-4 w-4" />,
        },
      ])
    }, 500)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          changeValue={metric.changeValue}
          icon={metric.icon}
        />
      ))}
    </div>
  )
}

