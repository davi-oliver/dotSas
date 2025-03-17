"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"

export function HelpContact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulação de envio
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      })

      // Limpa o formulário
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })

      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Entre em Contato</h2>
          <p className="mb-6 text-muted-foreground">
            Nossa equipe de suporte está pronta para ajudar. Preencha o formulário e entraremos em contato o mais rápido
            possível.
          </p>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Chat ao Vivo</h3>
                  <p className="text-sm text-muted-foreground">Disponível de Seg-Sex, 9h às 18h</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Email</h3>
                  <a href="mailto:suporte@sistema.com.br" className="text-sm text-primary hover:underline">
                    suporte@sistema.com.br
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-sm text-muted-foreground">(11) 3456-7890</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulário de Contato</CardTitle>
            <CardDescription>Preencha suas informações e dúvidas abaixo.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Assunto da mensagem"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Suporte Técnico</SelectItem>
                      <SelectItem value="billing">Faturamento</SelectItem>
                      <SelectItem value="feature">Sugestão de Funcionalidade</SelectItem>
                      <SelectItem value="bug">Relatar Problema</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Mensagem <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Descreva sua dúvida ou problema..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

