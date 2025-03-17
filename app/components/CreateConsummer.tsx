"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Função para formatar CPF
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

// Função para formatar telefone
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1")
}

// Validação de CPF
const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false

  // Validação do dígito verificador
  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanCPF.substring(10, 11))) return false

  return true
}

// Definição do esquema de validação
const customerSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z
    .string()
    .min(14, { message: "CPF inválido" })
    .refine((cpf) => validateCPF(cpf), { message: "CPF inválido" }),
  birthDate: z
    .date({
      required_error: "Data de nascimento é obrigatória",
    })
    .refine(
      (date) => {
        const today = new Date()
        const minimumAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
        return date <= minimumAge
      },
      { message: "Cliente deve ter pelo menos 18 anos" },
    ),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(14, { message: "Telefone inválido" }),
  address: z
    .object({
      street: z.string().min(3, { message: "Rua é obrigatória" }),
      number: z.string().min(1, { message: "Número é obrigatório" }),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
      city: z.string().min(2, { message: "Cidade é obrigatória" }),
      state: z.string().length(2, { message: "Estado inválido" }),
      zipCode: z.string().min(9, { message: "CEP inválido" }),
    })
    .optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

export default function CustomerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddress, setShowAddress] = useState(false)

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      phone: "",
    },
  })

  function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true)

    // Simulando envio para API
    console.log("Dados do cliente:", data)

    // Simulando tempo de processamento
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Cliente cadastrado com sucesso!")
      form.reset()
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro de Cliente</CardTitle>
            <CardDescription>Preencha os dados do cliente para cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1920}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddress(!showAddress)}>
                {showAddress ? "Ocultar Endereço" : "Adicionar Endereço"}
              </Button>
            </div>

            {showAddress && (
              <div className="space-y-6 border p-4 rounded-md">
                <h3 className="font-medium">Endereço</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address.complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto, Bloco, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .replace(/(\d{5})(\d)/, "$1-$2")
                                .replace(/(-\d{3})\d+?$/, "$1")
                              field.onChange(value)
                            }}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="UF"
                            maxLength={2}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase()
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Cadastrar Cliente"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

