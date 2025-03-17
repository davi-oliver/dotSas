"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react"

interface OrganizationIntegrationsProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface Integration {
  id: string
  name: string
  description: string
  logo: string
  status: "connected" | "disconnected"
  lastSync?: string
  config?: Record<string, string>
}

export default function OrganizationIntegrations({ refreshTrigger, onUpdate }: OrganizationIntegrationsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [configValues, setConfigValues] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockIntegrations: Integration[] = [
        {
          id: "stripe",
          name: "Stripe",
          description: "Processamento de pagamentos e assinaturas",
          logo: "/placeholder.svg?height=48&width=48",
          status: "connected",
          lastSync: "2023-07-15 14:30",
          config: {
            api_key: "sk_test_***********************",
            webhook_url: "https://api.example.com/webhooks/stripe",
          },
        },
        {
          id: "google",
          name: "Google Workspace",
          description: "Integração com Google Drive, Calendar e Gmail",
          logo: "/placeholder.svg?height=48&width=48",
          status: "connected",
          lastSync: "2023-07-14 09:15",
          config: {
            client_id: "123456789-abcdefg.apps.googleusercontent.com",
            client_secret: "********",
            redirect_uri: "https://app.example.com/auth/google/callback",
          },
        },
        {
          id: "slack",
          name: "Slack",
          description: "Notificações e comunicação em equipe",
          logo: "/placeholder.svg?height=48&width=48",
          status: "disconnected",
        },
        {
          id: "github",
          name: "GitHub",
          description: "Integração com repositórios e issues",
          logo: "/placeholder.svg?height=48&width=48",
          status: "disconnected",
        },
        {
          id: "zapier",
          name: "Zapier",
          description: "Automação com centenas de aplicativos",
          logo: "/placeholder.svg?height=48&width=48",
          status: "disconnected",
        },
      ]

      setIntegrations(mockIntegrations)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  const handleOpenConfig = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigValues(integration.config || {})
    setIsConfigDialogOpen(true)
  }

  const handleSaveConfig = () => {
    if (!selectedIntegration) return

    setIsSaving(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIntegrations(
        integrations.map((integration) =>
          integration.id === selectedIntegration.id
            ? {
                ...integration,
                status: "connected",
                config: configValues,
                lastSync: new Date().toISOString().replace("T", " ").substring(0, 16),
              }
            : integration,
        ),
      )

      setIsSaving(false)
      setIsConfigDialogOpen(false)
      onUpdate()
    }, 1500)
  }

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: enabled ? "connected" : "disconnected",
              lastSync: enabled ? new Date().toISOString().replace("T", " ").substring(0, 16) : undefined,
            }
          : integration,
      ),
    )

    onUpdate()
  }

  const handleSyncIntegration = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              lastSync: new Date().toISOString().replace("T", " ").substring(0, 16),
            }
          : integration,
      ),
    )

    onUpdate()
  }

  if (isLoading) {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
        <CardDescription>Conecte sua organização com outros serviços e ferramentas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={integration.logo || "/placeholder.svg"}
                      alt={integration.name}
                      className="h-10 w-10 rounded-md"
                    />
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.status === "connected"}
                    onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Conectado
                        </Badge>
                        {integration.lastSync && (
                          <span className="text-muted-foreground">Última sincronização: {integration.lastSync}</span>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline">Desconectado</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <Separator />
              <div className="p-3 bg-muted/10 flex justify-end gap-2">
                {integration.status === "connected" && (
                  <Button variant="outline" size="sm" onClick={() => handleSyncIntegration(integration.id)}>
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Sincronizar
                  </Button>
                )}
                <Button
                  variant={integration.status === "connected" ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleOpenConfig(integration)}
                >
                  {integration.status === "connected" ? "Configurar" : "Conectar"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedIntegration?.status === "connected"
                  ? `Configurar ${selectedIntegration?.name}`
                  : `Conectar com ${selectedIntegration?.name}`}
              </DialogTitle>
              <DialogDescription>
                {selectedIntegration?.status === "connected"
                  ? "Atualize as configurações da integração"
                  : "Configure as credenciais para conectar com este serviço"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedIntegration?.id === "stripe" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api_key">Chave de API</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={configValues.api_key || ""}
                      onChange={(e) => setConfigValues({ ...configValues, api_key: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">URL do Webhook</Label>
                    <Input
                      id="webhook_url"
                      value={configValues.webhook_url || ""}
                      onChange={(e) => setConfigValues({ ...configValues, webhook_url: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration?.id === "google" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input
                      id="client_id"
                      value={configValues.client_id || ""}
                      onChange={(e) => setConfigValues({ ...configValues, client_id: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_secret">Client Secret</Label>
                    <Input
                      id="client_secret"
                      type="password"
                      value={configValues.client_secret || ""}
                      onChange={(e) => setConfigValues({ ...configValues, client_secret: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redirect_uri">Redirect URI</Label>
                    <Input
                      id="redirect_uri"
                      value={configValues.redirect_uri || ""}
                      onChange={(e) => setConfigValues({ ...configValues, redirect_uri: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration?.id === "slack" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">Webhook URL</Label>
                    <Input
                      id="webhook_url"
                      value={configValues.webhook_url || ""}
                      onChange={(e) => setConfigValues({ ...configValues, webhook_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bot_token">Bot Token</Label>
                    <Input
                      id="bot_token"
                      type="password"
                      value={configValues.bot_token || ""}
                      onChange={(e) => setConfigValues({ ...configValues, bot_token: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration?.id === "github" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="access_token">Access Token</Label>
                    <Input
                      id="access_token"
                      type="password"
                      value={configValues.access_token || ""}
                      onChange={(e) => setConfigValues({ ...configValues, access_token: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repository">Repositório (opcional)</Label>
                    <Input
                      id="repository"
                      placeholder="usuario/repositorio"
                      value={configValues.repository || ""}
                      onChange={(e) => setConfigValues({ ...configValues, repository: e.target.value })}
                    />
                  </div>
                </>
              )}

              {selectedIntegration?.id === "zapier" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api_key">Chave de API</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={configValues.api_key || ""}
                      onChange={(e) => setConfigValues({ ...configValues, api_key: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveConfig} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : selectedIntegration?.status === "connected" ? (
                  "Salvar Configurações"
                ) : (
                  "Conectar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

