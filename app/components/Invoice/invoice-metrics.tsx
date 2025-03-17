"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

interface InvoiceMetricsProps {
  refreshTrigger?: number
}

interface MetricItem {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
}

export default function InvoiceMetrics({ refreshTrigger }: InvoiceMetricsProps) {
  const [metrics, setMetrics] = useState<MetricItem[]>([
    {
      title: "Total Faturado",
      value: "R$ 0,00",
      change: 0,
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      trend: "neutral",
    },
    {
      title: "Faturas Pendentes",
      value: "0",
      change: 0,
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      trend: "neutral",
    },
    {
      title: "Faturas Pagas",
      value: "0",
      change: 0,
      icon: <CheckCircle2 className="h-5 w-5 text-muted-foreground" />,
      trend: "neutral",
    },
    {
      title: "Faturas Vencidas",
      value: "0",
      change: 0,
      icon: <AlertTriangle className="h-5 w-5 text-muted-foreground" />,
      trend: "neutral",
    },
  ])

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setMetrics([
        {
          title: "Total Faturado",
          value: "R$ 45.780,00",
          change: 12.5,
          icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
          trend: "up",
        },
        {
          title: "Faturas Pendentes",
          value: "12",
          change: -5.2,
          icon: <Clock className="h-5 w-5 text-muted-foreground" />,
          trend: "down",
        },
        {
          title: "Faturas Pagas",
          value: "87",
          change: 8.7,
          icon: <CheckCircle2 className="h-5 w-5 text-muted-foreground" />,
          trend: "up",
        },
        {
          title: "Faturas Vencidas",
          value: "3",
          change: -15.3,
          icon: <AlertTriangle className="h-5 w-5 text-muted-foreground" />,
          trend: "down",
        },
      ])
    }, 500)
  }, [refreshTrigger])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">{metric.title}</p>
              {metric.icon}
            </div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center pt-1">
              {metric.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
              ) : metric.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-rose-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${
                  metric.trend === "up"
                    ? "text-emerald-500"
                    : metric.trend === "down"
                      ? "text-rose-500"
                      : "text-muted-foreground"
                }`}
              >
                {metric.change > 0 ? "+" : ""}
                {metric.change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

