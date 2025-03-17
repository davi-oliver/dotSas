"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface OrganizationSettingsProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface Settings {
  notifications: {
    email: boolean
    slack: boolean
    browser: boolean
  }
  security: {
    twoFactorAuth: boolean
    singleSignOn: boolean
    passwordExpiration: boolean
    ipRestriction: boolean
  }
  privacy: {
    dataSharing: boolean
    analytics: boolean
    cookieConsent: boolean
  }
}

export default function OrganizationSettings({ refreshTrigger, onUpdate }: OrganizationSettingsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [activeTab, setActiveTab] = useState("notifications")

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockSettings: Settings = {
        notifications: {
          email: true,
          slack: false,
          browser: true,
        },
        security: {
          twoFactorAuth: false,
          singleSignOn: false,
          passwordExpiration: true,
          ipRestriction: false,
        },
        privacy: {
          dataSharing: true,
          analytics: true,
          cookieConsent: true,
        },
      }

      setSettings(mockSettings)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  const handleToggleSetting = (section: keyof Settings, key: string, value: boolean) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    })
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsSaving(false)
      onUpdate()
    }, 1500)
  }

  const handleDeleteOrganization = () => {
    // Simulação de exclusão
    setIsDeleteDialogOpen(false)
    // Redirecionaria para outra página após exclusão
  }

  if (isLoading || !settings) {
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
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Gerencie as configurações da sua organização</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleToggleSetting("notifications", "email", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="slack-notifications">Notificações no Slack</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações no canal do Slack</p>
                </div>
                <Switch
                  id="slack-notifications"
                  checked={settings.notifications.slack}
                  onCheckedChange={(checked) => handleToggleSetting("notifications", "slack", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Notificações no Navegador</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações push no navegador</p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={settings.notifications.browser}
                  onCheckedChange={(checked) => handleToggleSetting("notifications", "browser", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">Exigir 2FA para todos os membros da organização</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => handleToggleSetting("security", "twoFactorAuth", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="single-sign-on">Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">Habilitar login único com provedor de identidade</p>
                </div>
                <Switch
                  id="single-sign-on"
                  checked={settings.security.singleSignOn}
                  onCheckedChange={(checked) => handleToggleSetting("security", "singleSignOn", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-expiration">Expiração de Senha</Label>
                  <p className="text-sm text-muted-foreground">Exigir alteração de senha a cada 90 dias</p>
                </div>
                <Switch
                  id="password-expiration"
                  checked={settings.security.passwordExpiration}
                  onCheckedChange={(checked) => handleToggleSetting("security", "passwordExpiration", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restriction">Restrição de IP</Label>
                  <p className="text-sm text-muted-foreground">Limitar acesso a endereços IP específicos</p>
                </div>
                <Switch
                  id="ip-restriction"
                  checked={settings.security.ipRestriction}
                  onCheckedChange={(checked) => handleToggleSetting("security", "ipRestriction", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Compartilhamento de Dados</Label>
                  <p className="text-sm text-muted-foreground">Permitir compartilhamento de dados com parceiros</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={(checked) => handleToggleSetting("privacy", "dataSharing", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Coletar dados anônimos para melhorar o serviço</p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => handleToggleSetting("privacy", "analytics", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cookie-consent">Consentimento de Cookies</Label>
                  <p className="text-sm text-muted-foreground">Exibir banner de consentimento de cookies</p>
                </div>
                <Switch
                  id="cookie-consent"
                  checked={settings.privacy.cookieConsent}
                  onCheckedChange={(checked) => handleToggleSetting("privacy", "cookieConsent", checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-destructive">Zona de Perigo</h3>

          <div className="rounded-md border border-destructive/50 p-4">
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-medium">Excluir Organização</h4>
                <p className="text-sm text-muted-foreground">
                  Excluir permanentemente esta organização e todos os seus dados. Esta ação não pode ser desfeita.
                </p>
              </div>

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Excluir Organização</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua organização e removerá todos os
                      dados associados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2 py-4">
                    <Label htmlFor="confirm">
                      Digite <span className="font-medium">excluir</span> para confirmar
                    </Label>
                    <Input
                      id="confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="excluir"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteOrganization}
                      disabled={confirmText !== "excluir"}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir Permanentemente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

