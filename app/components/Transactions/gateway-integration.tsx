"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentGatewayIntegrationProps {
  activeGateway: string
  setActiveGateway: (gateway: string) => void
}

interface Gateway {
  id: string
  name: string
  logo: string
  status: "active" | "inactive" | "pending"
  lastSync?: string
}

export default function PaymentGatewayIntegration({ activeGateway, setActiveGateway }: PaymentGatewayIntegrationProps) {
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "stripe",
      name: "Stripe",
      logo: "/placeholder.svg?height=40&width=80",
      status: "active",
      lastSync: "Hoje, 15:30",
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "/placeholder.svg?height=40&width=80",
      status: "active",
      lastSync: "Hoje, 14:45",
    },
    {
      id: "pagseguro",
      name: "PagSeguro",
      logo: "/placeholder.svg?height=40&width=80",
      status: "inactive",
    },
    {
      id: "mercadopago",
      name: "Mercado Pago",
      logo: "/placeholder.svg?height=40&width=80",
      status: "pending",
    },
  ])

  const [isAddingGateway, setIsAddingGateway] = useState(false)
  const [newGateway, setNewGateway] = useState({
    type: "",
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
  })

  const handleToggleGateway = (id: string, newStatus: "active" | "inactive") => {
    setGateways(gateways.map((gateway) => (gateway.id === id ? { ...gateway, status: newStatus } : gateway)))
  }

  const handleAddGateway = () => {
    // Simulação de adição de gateway
    const gatewayNames: Record<string, string> = {
      stripe: "Stripe",
      paypal: "PayPal",
      pagseguro: "PagSeguro",
      mercadopago: "Mercado Pago",
      cielo: "Cielo",
    }

    if (newGateway.type && !gateways.find((g) => g.id === newGateway.type)) {
      setGateways([
        ...gateways,
        {
          id: newGateway.type,
          name: gatewayNames[newGateway.type] || newGateway.type,
          logo: "/placeholder.svg?height=40&width=80",
          status: "pending",
        },
      ])
    }

    setIsAddingGateway(false)
    setNewGateway({
      type: "",
      apiKey: "",
      secretKey: "",
      webhookUrl: "",
    })
  }

  const getStatusBadge = (status: Gateway["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Ativo
          </Badge>
        )
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>
      case "pending":
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" /> Configuração Pendente
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Gateways de Pagamento
        </CardTitle>
        <CardDescription>Gerencie suas integrações com gateways de pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gateways" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gateways">Gateways</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="gateways">
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>Filtrar por Gateway</Label>
                <Select value={activeGateway} onValueChange={setActiveGateway}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos os gateways" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os gateways</SelectItem>
                    {gateways
                      .filter((g) => g.status === "active")
                      .map((gateway) => (
                        <SelectItem key={gateway.id} value={gateway.id}>
                          {gateway.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {gateways.map((gateway) => (
                  <div key={gateway.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-10 flex items-center justify-center bg-muted rounded">
                        <img
                          src={gateway.logo || "/placeholder.svg"}
                          alt={gateway.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{gateway.name}</h4>
                        <div className="flex items-center mt-1">
                          {getStatusBadge(gateway.status)}
                          {gateway.lastSync && (
                            <span className="text-xs text-muted-foreground ml-2">
                              Última sincronização: {gateway.lastSync}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {gateway.status !== "pending" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={gateway.status === "active"}
                            onCheckedChange={(checked) =>
                              handleToggleGateway(gateway.id, checked ? "active" : "inactive")
                            }
                          />
                          <Label className="text-sm">{gateway.status === "active" ? "Ativo" : "Inativo"}</Label>
                        </div>
                      )}
                      {gateway.status === "pending" && (
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Configurações Gerais</h3>
                <Dialog open={isAddingGateway} onOpenChange={setIsAddingGateway}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Gateway
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Gateway de Pagamento</DialogTitle>
                      <DialogDescription>Configure um novo gateway de pagamento para sua loja.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="gateway-type">Gateway</Label>
                        <Select
                          value={newGateway.type}
                          onValueChange={(value) => setNewGateway({ ...newGateway, type: value })}
                        >
                          <SelectTrigger id="gateway-type">
                            <SelectValue placeholder="Selecione um gateway" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="pagseguro">PagSeguro</SelectItem>
                            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                            <SelectItem value="cielo">Cielo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="api-key">Chave de API</Label>
                        <Input
                          id="api-key"
                          placeholder="pk_test_..."
                          value={newGateway.apiKey}
                          onChange={(e) => setNewGateway({ ...newGateway, apiKey: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secret-key">Chave Secreta</Label>
                        <Input
                          id="secret-key"
                          type="password"
                          placeholder="sk_test_..."
                          value={newGateway.secretKey}
                          onChange={(e) => setNewGateway({ ...newGateway, secretKey: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">URL de Webhook</Label>
                        <Input
                          id="webhook-url"
                          placeholder="https://sua-loja.com/api/webhooks/pagamentos"
                          value={newGateway.webhookUrl}
                          onChange={(e) => setNewGateway({ ...newGateway, webhookUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Configure este URL no painel do gateway para receber notificações.
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingGateway(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddGateway}>Adicionar Gateway</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Modo de Teste</h4>
                    <p className="text-sm text-muted-foreground">Ative para usar ambientes de sandbox dos gateways</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sincronização Automática</h4>
                    <p className="text-sm text-muted-foreground">
                      Sincronizar transações automaticamente a cada 30 minutos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações de Pagamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas sobre pagamentos, reembolsos e disputas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Sincronizar Dados
        </Button>
        <Button size="sm">Testar Conexões</Button>
      </CardFooter>
    </Card>
  )
}

