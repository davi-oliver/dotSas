"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Calendar, Download, FileText } from "lucide-react"

interface ReportsTabProps {
  gateway: string
}

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F59E0B", "#10B981", "#3B82F6"]

export default function ReportsTab({ gateway }: ReportsTabProps) {
  const [reportType, setReportType] = useState("financial")
  const [period, setPeriod] = useState("month")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Dados para relatório financeiro
  const financialData = [
    { name: "Jan", receita: 12500, reembolsos: 850, taxas: 375, liquido: 11275 },
    { name: "Fev", receita: 15000, reembolsos: 1200, taxas: 450, liquido: 13350 },
    { name: "Mar", receita: 18500, reembolsos: 950, taxas: 555, liquido: 16995 },
    { name: "Abr", receita: 16800, reembolsos: 1100, taxas: 504, liquido: 15196 },
    { name: "Mai", receita: 21000, reembolsos: 1500, taxas: 630, liquido: 18870 },
    { name: "Jun", receita: 24500, reembolsos: 1300, taxas: 735, liquido: 22465 },
    { name: "Jul", receita: 22800, reembolsos: 1400, taxas: 684, liquido: 20716 },
  ]

  // Dados para relatório de métodos de pagamento
  const paymentMethodsData = [
    { name: "Cartão de Crédito", value: 65 },
    { name: "PIX", value: 20 },
    { name: "Boleto", value: 10 },
    { name: "Cartão de Débito", value: 5 },
  ]

  // Dados para relatório de conciliação bancária
  const reconciliationData = [
    {
      id: "REC-001",
      date: "2023-07-15",
      description: "Liquidação de pagamentos",
      expected: 12500.0,
      received: 12500.0,
      status: "matched",
    },
    {
      id: "REC-002",
      date: "2023-07-10",
      description: "Liquidação de pagamentos",
      expected: 8750.0,
      received: 8750.0,
      status: "matched",
    },
    {
      id: "REC-003",
      date: "2023-07-05",
      description: "Liquidação de pagamentos",
      expected: 9200.0,
      received: 9180.0,
      status: "discrepancy",
    },
    {
      id: "REC-004",
      date: "2023-06-30",
      description: "Liquidação de pagamentos",
      expected: 11500.0,
      received: 11500.0,
      status: "matched",
    },
    {
      id: "REC-005",
      date: "2023-06-25",
      description: "Liquidação de pagamentos",
      expected: 7800.0,
      received: 7800.0,
      status: "matched",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Relatórios Financeiros</CardTitle>
            <CardDescription>Análise financeira e conciliação bancária</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={reportType} onValueChange={setReportType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="payment-methods">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="reconciliation">Conciliação Bancária</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{formatCurrency(24500)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Reembolsos</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{formatCurrency(1300)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Taxas</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{formatCurrency(735)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Receita Líquida</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="text-2xl font-bold">{formatCurrency(22465)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-4">Relatório Financeiro</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="receita" name="Receita Bruta" fill="#6366F1" />
                  <Bar dataKey="reembolsos" name="Reembolsos" fill="#F43F5E" />
                  <Bar dataKey="taxas" name="Taxas" fill="#F59E0B" />
                  <Bar dataKey="liquido" name="Receita Líquida" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-4">Detalhamento Financeiro</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Receita Bruta</TableHead>
                      <TableHead className="text-right">Reembolsos</TableHead>
                      <TableHead className="text-right">Taxas</TableHead>
                      <TableHead className="text-right">Receita Líquida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.receita)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.reembolsos)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.taxas)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.liquido)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-4">Distribuição por Método de Pagamento</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Análise de Métodos de Pagamento</h4>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Os cartões de crédito representam a maior parte das transações, seguidos por PIX que tem mostrado
                    crescimento constante nos últimos meses.
                  </p>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Taxa de Aprovação por Método</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Cartão de Crédito</span>
                        <span className="font-medium">92.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PIX</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Boleto</span>
                        <span className="font-medium">85.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cartão de Débito</span>
                        <span className="font-medium">94.1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Gerar Relatório Detalhado
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-4">
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-4">Conciliação Bancária</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor Esperado</TableHead>
                      <TableHead className="text-right">Valor Recebido</TableHead>
                      <TableHead className="text-right">Diferença</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliationData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.expected)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.received)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.received - item.expected)}</TableCell>
                        <TableCell>
                          {item.status === "matched" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              Conciliado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Divergência
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-4">Resumo da Conciliação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Total Esperado</CardTitle>
                  </CardHeader>
                  <CardContent className="py-1">
                    <div className="text-2xl font-bold">{formatCurrency(49750)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
                  </CardHeader>
                  <CardContent className="py-1">
                    <div className="text-2xl font-bold">{formatCurrency(49730)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Diferença</CardTitle>
                  </CardHeader>
                  <CardContent className="py-1">
                    <div className="text-2xl font-bold text-amber-500">{formatCurrency(-20)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Exportar Relatório de Conciliação
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

