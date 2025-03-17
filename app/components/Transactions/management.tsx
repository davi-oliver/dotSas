"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentGatewayIntegration from "./gateway-integration"
import PaymentMetrics from "./metrics"
import TransactionsTab from "./transactions-tab"
import RefundsTab from "./refunds-tabs"
import SubscriptionsTab from "./subscriptos-sub"
import ReportsTab from "./reports-tabs"


export default function PaymentManagement() {
  const [activeGateway, setActiveGateway] = useState<string>("all")

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PaymentGatewayIntegration activeGateway={activeGateway} setActiveGateway={setActiveGateway} />
        <PaymentMetrics gateway={activeGateway} />
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="refunds">Reembolsos</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionsTab gateway={activeGateway} />
        </TabsContent>

        <TabsContent value="refunds">
          <RefundsTab gateway={activeGateway} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionsTab gateway={activeGateway} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab gateway={activeGateway} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

