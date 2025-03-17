"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Upload, Loader2 } from "lucide-react"

interface OrganizationProfileProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface OrganizationData {
  name: string
  logo?: string
  description: string
  website: string
  email: string
  phone: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxInfo: {
    document: string
    type: string
    legalName: string
  }
}

export default function OrganizationProfile({ refreshTrigger, onUpdate }: OrganizationProfileProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockData: OrganizationData = {
        name: "Minha Empresa Ltda.",
        logo: "/placeholder.svg?height=128&width=128",
        description: "Empresa especializada em soluções de software para pequenas e médias empresas.",
        website: "https://minhaempresa.com.br",
        email: "contato@minhaempresa.com.br",
        phone: "(11) 3456-7890",
        address: {
          street: "Avenida Paulista",
          number: "1000",
          complement: "Sala 501",
          city: "São Paulo",
          state: "SP",
          zipCode: "01310-100",
          country: "Brasil",
        },
        taxInfo: {
          document: "12.345.678/0001-90",
          type: "CNPJ",
          legalName: "Minha Empresa Tecnologia Ltda.",
        },
      }

      setOrganization(mockData)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  const handleInputChange = (field: string, value: string) => {
    if (!organization) return

    if (field.includes(".")) {
      const [section, key] = field.split(".")
      setOrganization({
        ...organization,
        [section]: {
          ...(typeof organization[section as keyof OrganizationData] === 'object' && organization[section as keyof OrganizationData] !== null ? organization[section as keyof OrganizationData] as object : {}),
          [key]: value,
        },
      })
    } else {
      setOrganization({
        ...organization,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsSaving(false)
      onUpdate()
    }, 1500)
  }

  if (isLoading || !organization) {
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
        <CardTitle>Perfil da Organização</CardTitle>
        <CardDescription>Gerencie as informações da sua organização</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {organization.logo ? (
                <img
                  src={organization.logo || "/placeholder.svg"}
                  alt={organization.name}
                  className="h-32 w-32 rounded-md object-cover border"
                />
              ) : (
                <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Upload className="h-4 w-4" />
                <span className="sr-only">Alterar logo</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recomendado: 128x128px <br />
              PNG, JPG ou SVG, máx. 2MB
            </p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Organização</Label>
              <Input id="name" value={organization.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                value={organization.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={organization.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email de Contato</Label>
                <Input
                  id="email"
                  type="email"
                  value={organization.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={organization.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Endereço</TabsTrigger>
            <TabsTrigger value="tax">Informações Fiscais</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="street">Rua/Avenida</Label>
                <Input
                  id="street"
                  value={organization.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={organization.address.number}
                  onChange={(e) => handleInputChange("address.number", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={organization.address.complement || ""}
                onChange={(e) => handleInputChange("address.complement", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={organization.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={organization.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={organization.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={organization.address.country}
                onChange={(e) => handleInputChange("address.country", e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="tax" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão Social</Label>
              <Input
                id="legalName"
                value={organization.taxInfo.legalName}
                onChange={(e) => handleInputChange("taxInfo.legalName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document">CNPJ/CPF</Label>
                <Input
                  id="document"
                  value={organization.taxInfo.document}
                  onChange={(e) => handleInputChange("taxInfo.document", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Documento</Label>
                <Input
                  id="type"
                  value={organization.taxInfo.type}
                  onChange={(e) => handleInputChange("taxInfo.type", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

