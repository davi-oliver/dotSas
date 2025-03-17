"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, DollarSign, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react"

interface PaymentMetricsProps {
  gateway: string
}

interface MetricData {
  value: number
  change: number
  trend: "up" | "down" | "neutral"
}

interface Metrics {
  totalRevenue: MetricData
  successRate: MetricData
  avgTicket: MetricData
  refundRate: MetricData
}

const dailyData = [
  { name: "Seg", receita: 1200, reembolsos: 120 },
  { name: "Ter", receita: 1800, reembolsos: 90 },
  { name: "Qua", receita: 1400, reembolsos: 70 },
  { name: "Qui", receita: 2000, reembolsos: 100 },
  { name: "Sex", receita: 2400, reembolsos: 150 },
  { name: "Sáb", receita: 1800, reembolsos: 80 },
  { name: "Dom", receita: 1200, reembolsos: 60 },
]

const weeklyData = [
  { name: "Sem 1", receita: 8800, reembolsos: 670 },
  { name: "Sem 2", receita: 9200, reembolsos: 580 },
  { name: "Sem 3", receita: 10800, reembolsos: 720 },
  { name: "Sem 4", receita: 11400, reembolsos: 850 },
]

export default function PaymentMetrics({ gateway }: PaymentMetricsProps) {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily")
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: { value: 0, change: 0, trend: "neutral" },
    successRate: { value: 0, change: 0, trend: "neutral" },
    avgTicket: { value: 0, change: 0, trend: "neutral" },
    refundRate: { value: 0, change: 0, trend: "neutral" },
  })

  useEffect(() => {
    // Simulação de carregamento de dados com base no gateway selecionado
    setTimeout(() => {
      if (gateway === "stripe") {
        setMetrics({
          totalRevenue: { value: 12800, change: 12.5, trend: "up" },
          successRate: { value: 94.8, change: 2.3, trend: "up" },
          avgTicket: { value: 189.5, change: 5.2, trend: "up" },
          refundRate: { value: 3.2, change: -1.5, trend: "down" },
        })
      } else if (gateway === "paypal") {
        setMetrics({
          totalRevenue: { value: 8600, change: 8.7, trend: "up" },
          successRate: { value: 92.1, change: 1.5, trend: "up" },
          avgTicket: { value: 142.3, change: -2.1, trend: "down" },
          refundRate: { value: 4.5, change: 0.8, trend: "up" },
        })
      } else {
        setMetrics({
          totalRevenue: { value: 21400, change: 10.2, trend: "up" },
          successRate: { value: 93.5, change: 1.8, trend: "up" },
          avgTicket: { value: 167.8, change: 3.4, trend: "up" },
          refundRate: { value: 3.8, change: -0.5, trend: "down" },
        })
      }
    }, 500)
  }, [gateway])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getChartData = () => {
    return period === "daily" ? dailyData : weeklyData
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral", size = 4) => {
    if (trend === "up") return <TrendingUp className={`h-${size} w-${size} text-emerald-500`} />
    if (trend === "down") return <TrendingDown className={`h-${size} w-${size} text-rose-500`} />
    return <RefreshCcw className={`h-${size} w-${size} text-muted-foreground`} />
  }

  const getTrendArrow = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-emerald-500" />
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-rose-500" />
    return null
  }

  const getTrendClass = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return "text-emerald-500"
    if (trend === "down") return "text-rose-500"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Métricas de Pagamento</CardTitle>
            <CardDescription>Visão geral do desempenho de pagamentos</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as "daily" | "weekly")}>
            <TabsList>
              <TabsTrigger value="daily">Diário</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">Receita Total</span>
              </div>
              {getTrendIcon(metrics.totalRevenue.trend)}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue.value)}</span>
              <div className="flex items-center">
                {getTrendArrow(metrics.totalRevenue.trend)}
                <span className={`text-sm ${getTrendClass(metrics.totalRevenue.trend)}`}>
                  {metrics.totalRevenue.change > 0 ? "+" : ""}
                  {metrics.totalRevenue.change}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Sucesso</span>
              {getTrendIcon(metrics.successRate.trend)}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{metrics.successRate.value}%</span>
              <div className="flex items-center">
                {getTrendArrow(metrics.successRate.trend)}
                <span className={`text-sm ${getTrendClass(metrics.successRate.trend)}`}>
                  {metrics.successRate.change > 0 ? "+" : ""}
                  {metrics.successRate.change}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ticket Médio</span>
              {getTrendIcon(metrics.avgTicket.trend)}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{formatCurrency(metrics.avgTicket.value)}</span>
              <div className="flex items-center">
                {getTrendArrow(metrics.avgTicket.trend)}
                <span className={`text-sm ${getTrendClass(metrics.avgTicket.trend)}`}>
                  {metrics.avgTicket.change > 0 ? "+" : ""}
                  {metrics.avgTicket.change}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Reembolso</span>
              {getTrendIcon(metrics.refundRate.trend, metrics.refundRate.trend === "down" ? 4 : 4)}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{metrics.refundRate.value}%</span>
              <div className="flex items-center">
                {getTrendArrow(metrics.refundRate.trend === "up" ? "down" : "up")}
                <span className={`text-sm ${getTrendClass(metrics.refundRate.trend === "up" ? "down" : "up")}`}>
                  {metrics.refundRate.change > 0 ? "+" : ""}
                  {metrics.refundRate.change}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="text-sm font-medium mb-4">Receita vs Reembolsos</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `${period === "daily" ? "Dia" : "Semana"}: ${label}`}
              />
              <Bar dataKey="receita" name="Receita" fill="#6366F1" />
              <Bar dataKey="reembolsos" name="Reembolsos" fill="#F43F5E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

