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
import { Corporate } from "@/types/organization"
import { z } from "zod"
import { add } from "date-fns"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/utils/supabase/client"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

// zod 
const OrganizationSchema = z.object({
  trade_name: z.string().min(1, "Nome da empresa é obrigatório"),
  logo: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  address_id: z.number().optional(), // Será preenchido após inserir o endereço

  website: z.string().url("URL inválida").optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    neighborhood: z.string().optional(),
    zipCode: z.string().min(1, "CEP é obrigatório"),

  }),
  type_document: z.string().min(1, "Tipo de documento é obrigatório"),
  identify: z.string().min(1, "Identificação é obrigatória"),
  social_name: z.string().min(1, "Razão social é obrigatória"),
})



interface OrganizationProfileProps {
  refreshTrigger?: number
  onUpdate: () => void
}


export default function OrganizationProfile({ refreshTrigger, onUpdate }: OrganizationProfileProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [organization, setOrganization] = useState<Corporate | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  type OrganizationFormValues = z.infer<typeof OrganizationSchema>
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      trade_name: "",
      logo: "",
      description: "",
      website: "",
      email: "",
      phone: "",
      address_id: 0, // Inicialmente 0, será atualizado após inserir o endereço
      address: {
        street: "",
        number: "",
        neighborhood: "",
        complement: "",
        city: "",
        state: "",
        zipCode: "",

      },
      identify:"",
      type_document: "",
      social_name: "",

    },
  })


  async function fetchOrganization() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("corporate")
      .select("*")


    if (error) {
      console.error("Error fetching corporate data:", error)
      return null
    }
    console.log({ data })

    return data
  }

  useEffect(() => {
    async function loadOrganization() {
      setIsLoading(true)
      const data = await fetchOrganization()

      if (data && data.length > 0) {
        const orgData = data[0] as Corporate
        setOrganization(orgData)

        // Preencher os valores do formulário com os dados da organização
        form.reset({
          trade_name: orgData.trade_name || "",
          logo: orgData.logo || "",
          description: orgData.description || "",
          website: orgData.website || "",
          email: orgData.email || "",
          phone: orgData.phone || "",
          address: {
            street: orgData.address?.street || "",
            number: orgData.address?.number || "",
            neighborhood: orgData.address?.neighborhood || "",
            complement: orgData.address?.complement || "",
            city: orgData.address?.city || "",
            state: orgData.address?.state || "",
            zipCode: orgData.address?.zipCode || "",

          },
          identify: orgData.indentify ? String(orgData.indentify) : "" ,
          type_document: orgData.type_document || "",
          social_name: orgData.social_name || "",
        })
      } else {
        const defaultOrganization: Corporate = {

          trade_name: "",
          logo: "",
          description: "",
          website: "",
          email: "",
          phone: "",
          address: {
            street: "",
            number: "",
            complement: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          indentify: 0,
          type_document: "",
          social_name: "",
        }
        setOrganization(defaultOrganization)
      }
      setIsLoading(false)
    }

    loadOrganization()
  },
    [refreshTrigger, form])


  const handleInputChange = (field: string, value: string) => {
    if (!organization) return

    if (field.includes(".")) {
      const [section, key] = field.split(".")
      setOrganization({
        ...organization,
        [section]: {
          ...(typeof organization[section as keyof Corporate] === 'object' && organization[section as keyof Corporate] !== null ? organization[section as keyof Corporate] as object : {}),
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

  async function onSubmit(formData: OrganizationFormValues) {
    // handleSubmit(data)
    setIsSaving(true)
    console.log({ formData })
    // Preparar os dados para o formato esperado pelo Supabase
    const organizationData: OrganizationFormValues = {
      trade_name: formData.trade_name,
      description: formData.description ?? "",
      logo: formData.logo ?? "",
      website: formData.website ?? "",
      address_id: 0, // Inicialmente 0, será atualizado após inserir o endereço
      email: formData.email ?? "",
      phone: formData.phone ?? "",
      address: {
        street: formData.address.street ?? "",
        number: formData.address.number ?? "",
        complement: formData.address.complement ?? "",
        city: formData.address.city ?? "",
        state: formData.address.state ?? "",
        zipCode: formData.address.zipCode ?? "",

      },
      identify: formData.identify ?? 0,
      type_document: formData.type_document ?? "",
      social_name: formData.social_name ?? "",
    }
    console.log({ organizationData })
    const supabase = createClient()


    let { data: newAddress, error: addressError } = await supabase.from('address').insert([
      {
        street: organizationData.address.street,
        number: organizationData.address.number,
        complement: organizationData.address.complement,
        city: organizationData.address.city,
        state: organizationData.address.state,
        neighborhood: organizationData.address.neighborhood ?? "",
        zip_code: organizationData.address.zipCode,

      }
    ]).select('*').single()

    if (addressError) {
      console.error("Error inserting address:", addressError)
      toast({
        variant: "destructive",
        title: "Erro ao salvar endereço",
        description: "Por favor, verifique os campos preenchidos.",
        action: <ToastAction altText="Tente novamente">Tente novamente</ToastAction>,
      })
      setIsSaving(false)
      return;
    }
    if (newAddress) {
      console.log("New address inserted:", newAddress)
      // Adicionar o ID do endereço ao objeto organizationData
      organizationData.address_id = newAddress.id ?? 0;



      let { data, error } = await supabase
        .from('corporate')
        .insert([organizationData])

      if (error) {
        console.log(error)

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })

        return;

      }
      toast({
        variant: "default",
        className: "bg-success/50",
        title: "Finalizado",
        description: "Seu produto foi cadastrado com sucesso.",
        action: <ToastAction altText="Ok">ok</ToastAction>,
      })

      setIsSaving(false)
      onUpdate() // Chama a função de atualização passada como prop
      console.log({ data })
      return;
    }



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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      alt={organization.trade_name ?? "Organização"}
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
                  <FormField
                    control={form.control}
                    name="trade_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome corporativo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome corporativo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <div className="space-y-2">
                  {/* <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={organization.description ?? ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                /> */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escreva uma breve descrição da sua corporação</FormLabel>
                        <FormControl>
                          <Input placeholder="descrição" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link para site</FormLabel>
                          <FormControl>
                            <Input placeholder="Site" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input placeholder="Telefone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                    <FormField
                      control={form.control}
                      name="address.neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua/Avenida</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua/Avenida" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="address.complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="CEP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

               

              </TabsContent>

              <TabsContent value="tax" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="social_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão social</FormLabel>
                        <FormControl>
                          <Input placeholder="Razão social" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="identify"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/CNPJ</FormLabel>
                          <FormControl>
                            <Input placeholder="CPF/CNPJ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="type_document"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl>
                            <Input placeholder="Tipo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => {
              try {
                const data = OrganizationSchema.parse(form.getValues())
                onSubmit(data)
              } catch (error) {
                console.error("Validation error:", error)
                toast({
                  variant: "destructive",
                  title: "Erro de validação",
                  description: "Por favor, verifique os campos preenchidos.",
                  action: <ToastAction altText="Tente novamente">Tente novamente</ToastAction>,
                })
              }

            }} disabled={isSaving}>
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
      </form>
    </Form>
  )
}

