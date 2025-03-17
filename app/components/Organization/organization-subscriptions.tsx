"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, CreditCard, Loader2, RefreshCcw, Zap } from "lucide-react"

interface OrganizationSubscriptionProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  billingCycle: "monthly" | "yearly"
  features: string[]
  limits: {
    members: number
    projects: number
    storage: number
  }
  isCurrent: boolean
}

interface CurrentSubscription {
  plan: string
  status: "active" | "trialing" | "past_due" | "canceled"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  paymentMethod: {
    type: "card" | "bank_transfer" | "pix"
    last4?: string
    brand?: string
    expiryMonth?: number
    expiryYear?: number
  }
  usage: {
    members: {
      used: number
      limit: number
    }
    projects: {
      used: number
      limit: number
    }
    storage: {
      used: number
      limit: number
    }
  }
}

export default function OrganizationSubscription({ refreshTrigger, onUpdate }: OrganizationSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isChangingPlan, setIsChangingPlan] = useState(false)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockSubscription: CurrentSubscription = {
        plan: "pro",
        status: "active",
        currentPeriodStart: "2023-07-01",
        currentPeriodEnd: "2023-08-01",
        cancelAtPeriodEnd: false,
        paymentMethod: {
          type: "card",
          last4: "4242",
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2025,
        },
        usage: {
          members: {
            used: 5,
            limit: 10,
          },
          projects: {
            used: 8,
            limit: 20,
          },
          storage: {
            used: 2.5,
            limit: 10,
          },
        },
      }

      const mockPlans: SubscriptionPlan[] = [
        {
          id: "free",
          name: "Gratuito",
          description: "Para pequenos projetos e testes",
          price: 0,
          billingCycle: "monthly",
          features: ["Até 3 membros", "Até 2 projetos", "1GB de armazenamento", "Suporte por email"],
          limits: {
            members: 3,
            projects: 2,
            storage: 1,
          },
          isCurrent: false,
        },
        {
          id: "pro",
          name: "Profissional",
          description: "Para equipes em crescimento",
          price: 49.9,
          billingCycle: "monthly",
          features: [
            "Até 10 membros",
            "Até 20 projetos",
            "10GB de armazenamento",
            "Suporte prioritário",
            "Recursos avançados",
          ],
          limits: {
            members: 10,
            projects: 20,
            storage: 10,
          },
          isCurrent: true,
        },
        {
          id: "business",
          name: "Empresarial",
          description: "Para empresas e grandes equipes",
          price: 99.9,
          billingCycle: "monthly",
          features: [
            "Membros ilimitados",
            "Projetos ilimitados",
            "100GB de armazenamento",
            "Suporte 24/7",
            "Recursos avançados",
            "Integrações personalizadas",
          ],
          limits: {
            members: 999,
            projects: 999,
            storage: 100,
          },
          isCurrent: false,
        },
      ]

      setSubscription(mockSubscription)
      setPlans(mockPlans)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  const handleChangePlan = () => {
    if (!selectedPlanId) return

    setIsChangingPlan(true)

    // Simulação de envio para API
    setTimeout(() => {
      setPlans(
        plans.map((plan) => ({
          ...plan,
          isCurrent: plan.id === selectedPlanId,
        })),
      )

      if (subscription) {
        const newPlan = plans.find((p) => p.id === selectedPlanId)
        if (newPlan) {
          setSubscription({
            ...subscription,
            plan: selectedPlanId,
            usage: {
              ...subscription.usage,
              members: {
                ...subscription.usage.members,
                limit: newPlan.limits.members,
              },
              projects: {
                ...subscription.usage.projects,
                limit: newPlan.limits.projects,
              },
              storage: {
                ...subscription.usage.storage,
                limit: newPlan.limits.storage,
              },
            },
          })
        }
      }

      setIsChangingPlan(false)
      setIsUpgradeDialogOpen(false)
      onUpdate()
    }, 1500)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatStorageSize = (sizeInGB: number) => {
    return `${sizeInGB} GB`
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min(Math.round((used / limit) * 100), 100)
  }

  const getStatusBadge = (status: CurrentSubscription["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Ativo</Badge>
      case "trialing":
        return <Badge variant="secondary">Período de Teste</Badge>
      case "past_due":
        return <Badge variant="destructive">Pagamento Pendente</Badge>
      case "canceled":
        return <Badge variant="outline">Cancelado</Badge>
    }
  }

  if (isLoading || !subscription) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentPlan = plans.find((plan) => plan.isCurrent)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assinatura</CardTitle>
        <CardDescription>Gerencie seu plano e uso de recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Plano {currentPlan?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentPlan?.description}</p>
              </div>
              {getStatusBadge(subscription.status)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Preço</span>
                <span className="font-medium">
                  {formatCurrency(currentPlan?.price || 0)}/{currentPlan?.billingCycle === "monthly" ? "mês" : "ano"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Próxima cobrança</span>
                <span>{subscription.currentPeriodEnd}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Método de pagamento</span>
                <span className="flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  {subscription.paymentMethod.brand?.toUpperCase()} •••• {subscription.paymentMethod.last4}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Atualizar Pagamento
              </Button>
              {subscription.cancelAtPeriodEnd ? (
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reativar Assinatura
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1">
                  Cancelar Assinatura
                </Button>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />

          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-medium">Uso de Recursos</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Membros</span>
                  <span>
                    {subscription.usage.members.used} de {subscription.usage.members.limit}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(subscription.usage.members.used, subscription.usage.members.limit)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Projetos</span>
                  <span>
                    {subscription.usage.projects.used} de {subscription.usage.projects.limit}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(subscription.usage.projects.used, subscription.usage.projects.limit)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Armazenamento</span>
                  <span>
                    {formatStorageSize(subscription.usage.storage.used)} de{" "}
                    {formatStorageSize(subscription.usage.storage.limit)}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(subscription.usage.storage.used, subscription.usage.storage.limit)}
                />
              </div>
            </div>

            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Alterar Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Escolha um Plano</DialogTitle>
                  <DialogDescription>
                    Selecione o plano que melhor atende às necessidades da sua organização
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="monthly">Mensal</TabsTrigger>
                    <TabsTrigger value="yearly">Anual (2 meses grátis)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="monthly" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <Card key={plan.id} className={`flex flex-col ${plan.isCurrent ? "border-primary" : ""}`}>
                          <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="mb-4">
                              <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                              <span className="text-muted-foreground">/mês</span>
                            </div>

                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            {plan.isCurrent ? (
                              <Button variant="outline" className="w-full" disabled>
                                Plano Atual
                              </Button>
                            ) : (
                              <Button
                                className="w-full"
                                variant={plan.id === selectedPlanId ? "default" : "outline"}
                                onClick={() => setSelectedPlanId(plan.id)}
                              >
                                {plan.id === selectedPlanId ? "Selecionado" : "Selecionar"}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="yearly" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <Card key={plan.id} className={`flex flex-col ${plan.isCurrent ? "border-primary" : ""}`}>
                          <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="mb-4">
                              <span className="text-3xl font-bold">{formatCurrency(plan.price * 10)}</span>
                              <span className="text-muted-foreground">/ano</span>
                            </div>

                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            {plan.isCurrent ? (
                              <Button variant="outline" className="w-full" disabled>
                                Plano Atual
                              </Button>
                            ) : (
                              <Button
                                className="w-full"
                                variant={plan.id === selectedPlanId ? "default" : "outline"}
                                onClick={() => setSelectedPlanId(plan.id)}
                              >
                                {plan.id === selectedPlanId ? "Selecionado" : "Selecionar"}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleChangePlan}
                    disabled={isChangingPlan || !selectedPlanId || selectedPlanId === currentPlan?.id}
                  >
                    {isChangingPlan ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Confirmar Alteração"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

