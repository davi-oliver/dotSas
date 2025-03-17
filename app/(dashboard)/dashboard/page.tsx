import FinancialReport from "@/app/components/FinancialReports"
import InventorySummary from "@/app/components/InventarySumary"
import KpiCards from "@/app/components/KpiCards"
import DashboardMetrics from "@/app/components/Metrics"
import ProductsPerformance from "@/app/components/ProductsPerformance"
import RecentActivities from "@/app/components/RecentActivity"
import SalesChart from "@/app/components/SalesChart"
import { DateRangePicker } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Relatórios e análises do seu negócio</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <KpiCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <SalesChart className="lg:col-span-4" />
              <RecentActivities className="lg:col-span-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <ProductsPerformance className="lg:col-span-4" />
              <InventorySummary className="lg:col-span-3" />
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <DashboardMetrics />
            <SalesChart className="w-full" />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ProductsPerformance className="lg:col-span-2" />
              <InventorySummary className="lg:col-span-1" />
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <FinancialReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

