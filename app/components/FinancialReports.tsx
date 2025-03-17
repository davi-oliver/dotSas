"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const monthlyData = [
  { month: "Jan", receita: 18000, despesas: 12600, lucro: 5400 },
  { month: "Fev", receita: 16000, despesas: 11200, lucro: 4800 },
  { month: "Mar", receita: 21000, despesas: 14700, lucro: 6300 },
  { month: "Abr", receita: 19500, despesas: 13650, lucro: 5850 },
  { month: "Mai", receita: 22800, despesas: 15960, lucro: 6840 },
  { month: "Jun", receita: 24000, despesas: 16800, lucro: 7200 },
]

const quarterlyData = [
  { quarter: "Q1", receita: 55000, despesas: 38500, lucro: 16500 },
  { quarter: "Q2", receita: 66300, despesas: 46410, lucro: 19890 },
  { quarter: "Q3", receita: 79780, despesas: 55846, lucro: 23934 },
  { quarter: "Q4", receita: 95000, despesas: 66500, lucro: 28500 },
]

const yearlyData = [
  { year: "2020", receita: 195000, despesas: 136500, lucro: 58500 },
  { year: "2021", receita: 230000, despesas: 161000, lucro: 69000 },
  { year: "2022", receita: 278000, despesas: 194600, lucro: 83400 },
  { year: "2023", receita: 296080, despesas: 207256, lucro: 88824 },
]

const expenseBreakdown = [
  { name: "Produtos", value: 60 },
  { name: "Marketing", value: 15 },
  { name: "Operacional", value: 10 },
  { name: "Impostos", value: 8 },
  { name: "Outros", value: 7 },
]

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F59E0B"]

export default function FinancialReport() {
  const [period, setPeriod] = useState("monthly")

  const getDataByPeriod = () => {
    switch (period) {
      case "monthly":
        return monthlyData
      case "quarterly":
        return quarterlyData
      case "yearly":
        return yearlyData
      default:
        return monthlyData
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getXAxisKey = () => {
    switch (period) {
      case "monthly":
        return "month"
      case "quarterly":
        return "quarter"
      case "yearly":
        return "year"
      default:
        return "month"
    }
  }

  const calculateTotals = () => {
    const data = getDataByPeriod()
    return {
      receita: data.reduce((acc, item) => acc + item.receita, 0),
      despesas: data.reduce((acc, item) => acc + item.despesas, 0),
      lucro: data.reduce((acc, item) => acc + item.lucro, 0),
    }
  }

  const totals = calculateTotals()
  const marginPercent = Math.round((totals.lucro / totals.receita) * 100)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório Financeiro</CardTitle>
              <CardDescription>Análise detalhada de receitas, despesas e lucros</CardDescription>
            </div>
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="quarterly">Trimestral</TabsTrigger>
                <TabsTrigger value="yearly">Anual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              </CardHeader>
              <CardContent className="py-1">
                <div className="text-2xl font-bold">{formatCurrency(totals.receita)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent className="py-1">
                <div className="text-2xl font-bold">{formatCurrency(totals.despesas)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Lucro</CardTitle>
              </CardHeader>
              <CardContent className="py-1">
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold">{formatCurrency(totals.lucro)}</div>
                  <div className="text-sm text-emerald-500">Margem: {marginPercent}%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm font-medium">Receitas vs Despesas</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getDataByPeriod()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getXAxisKey()} />
                  <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="receita" name="Receita" fill="#6366F1" />
                  <Bar dataKey="despesas" name="Despesas" fill="#F43F5E" />
                  <Bar dataKey="lucro" name="Lucro" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium">Distribuição de Despesas</h4>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-4 text-sm font-medium">Detalhamento Financeiro</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{period === "monthly" ? "Mês" : period === "quarterly" ? "Trimestre" : "Ano"}</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                  <TableHead className="text-right">Margem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDataByPeriod().map((item) => (
                  <TableRow  >
                    <TableCell className="font-medium">
                      {"month" in item ? item.month : "quarter" in item ? item.quarter : item.year}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.receita)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.despesas)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.lucro)}</TableCell>
                    <TableCell className="text-right">{Math.round((item.lucro / item.receita) * 100)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

