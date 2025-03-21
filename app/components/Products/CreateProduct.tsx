"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"
import { CalendarIcon, Loader2, Plus, Trash2, Upload } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"


// Editor de texto rico
import dynamic from "next/dynamic"
import { Separator } from "@radix-ui/react-select"
 
import { createClient } from "@/utils/supabase/client" 
import { Toast, ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
const RichTextEditor = dynamic(() => import("@/app/components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md flex items-center justify-center">Carregando editor...</div>,
})

    // Definição do esquema de validação
    const productSchema = z.object({
      // Informações Básicas
      name: z.string().min(3, { message: "Nome do produto é obrigatório" }),
      description: z.string().optional(),
      category_id: z.string({ required_error: "Selecione uma categoria" }),
      brand: z.string().optional(),
      sku: z.string().min(1, { message: "Código/SKU é obrigatório" }),
    
      // Preço e Promoção
      price: z.coerce.number().min(0.01, { message: "Preço deve ser maior que zero" }),
      price_offer: z.coerce.number().optional(),
      date_create_promotion: z.date().optional(),
      date_end_promotion: z.date().optional(),
      taxa: z.string().optional(),
    
      // Estoque e Logística
      ammount_stock: z.coerce.number().int().min(0, { message: "Estoque não pode ser negativo" }),
      min_stock: z.coerce.number().int().min(0).optional(),
      barscode: z.string().optional(),
      heigther: z.coerce.number().min(0).optional(),
      height: z.coerce.number().min(0).optional(),
      width: z.coerce.number().min(0).optional(),
      depth: z.coerce.number().min(0).optional(),
      days_produtions_create: z.coerce.number().int().min(0).optional(),
    
      // Outras Informações
      active: z.boolean().default(true),
      is_main: z.boolean().default(false),
      tags: z.string().optional(),
      seo: z.string().max(160, { message: "Descrição SEO deve ter no máximo 160 caracteres" }).optional(),
    })




    export default function ProductRegistrationForm({ product_id }: { product_id?: string }) {
   type ProductFormValues = z.infer<typeof productSchema>
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [variants, setVariants] = useState<
    {
      id: string
      attribute: string
      value: string
      price: string
      stock: string
    }[]
  >([])
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      ammount_stock: 0,
      active: true,
      is_main: false,
    },
  })
 

  async function fetchProductData() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("id", product_id)
      .single()

    if (error) {
      console.error("Error fetching product data:", error)
      return null
    }
    console.log({data})

    return data
  }

  useEffect(() => {
    console.log({product_id})
    if(!product_id) return;
    fetchProductData().then((productData) => {
      if (productData) {
        form.reset({
          name: productData.name,
          description: productData.description,
          category_id: productData.category_id ? productData.category_id.toString() : "",
          brand: productData.brand,
          sku: productData.sku,
          price: productData.price,
          price_offer: productData.price_offer,
          date_create_promotion: productData.date_create_promotion
            ? new Date(productData.date_create_promotion)
            : undefined,
          date_end_promotion: productData.date_end_promotion
            ? new Date(productData.date_end_promotion)
            : undefined,
          taxa: productData.taxa.toString(),
          ammount_stock: productData.ammount_stock,
          min_stock: productData.min_stock,
          barscode: productData.barscode,
          heigther: productData.heigther,
          height: productData.height,
          width: productData.width,
          depth: productData.depth,
          days_produtions_create: productData.days_produtions_create,
          active: productData.active,
          is_main: productData.is_main,
          tags: productData.tags ? productData.tags.join(", ") : "",
          seo: productData.seo,
        })
      }
    })
  }, [])
  

 // Modifique a função onSubmit para usar o serviço de criação de produto:
 async function onSubmit(formData: ProductFormValues) {
  // handleSubmit(data)
  setIsSubmitting(true)
  console.log({ formData })
  // Preparar os dados para o formato esperado pelo Supabase
  const productData: Product = {
    name: formData.name,
    description: formData.description ?? "",
    category_id: 1,
    brand: formData.brand ?? "",
    sku: formData.sku,
    price: formData.price,
    price_offer: formData.price_offer ?? 0,
    date_create_promotion:  
    formData.date_create_promotion ?? new Date(Date.now()),
    date_end_promotion: formData.date_end_promotion ?? new Date(Date.now()) ,
    taxa: Number(formData.taxa) ?? 0,
    heigth: formData.height ?? 0,
    link_product: "",
   
 
    ammount_stock: formData.ammount_stock,
    min_stock: formData.min_stock ?? 0,
    barscode: formData.barscode ?? "",
    heigther: formData.heigther ?? 0,
  
    width: formData.width ?? 0,
    depth: formData.depth ?? 0,
    days_produtions_create: formData.days_produtions_create || 0,
    active: formData.active,
    is_main: formData.is_main,
    tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
    seo: formData.seo ?? "",
    // : videoUrl,
    // variants: variants.map((v) => ({
    //   attribute: v.attribute,
    //   value: v.value,
    //   price: Number.parseFloat(v.price) || 0,
    //   stock: Number.parseInt(v.stock) || 0,
    // })),
  } 
  console.log({productData})
  const supabase = createClient()

    
  let { data, error } = await supabase
  .from('product')
  .insert([productData])

  if (error) {
    console.log(error) 
      
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    })

    return ;

  } 
  toast({
    variant: "default",
    className: "bg-success/50",
    title: "Finalizado",
    description: "Seu produto foi cadastrado com sucesso.",
    action: <ToastAction altText="Ok">ok</ToastAction>,
  })

  router.push("/products")
  setIsSubmitting(false)

  console.log({data})
  return ;
   
  
}

  // Simulando tempo de processamento
  //   setTimeout(() => {
  //     setIsSubmitting(false)
  //     alert("Produto cadastrado com sucesso!")
  //     form.reset()
  //     setImages([])
  //     setVideoUrl("")
  //     setVariants([])
  //     setActiveTab("basic")
  //   }, 1500)
  // }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { id: Date.now().toString(), attribute: "", value: "", price: "", stock: "" }])
  }

  const updateVariant = (id: string, field: string, value: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)))
  }

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="price">Preço e Promoção</TabsTrigger>
            <TabsTrigger value="stock">Estoque e Logística</TabsTrigger>
            <TabsTrigger value="media">Imagens e Mídias</TabsTrigger>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
            <TabsTrigger value="other">Outras Informações</TabsTrigger>
          </TabsList>

          {/* 1️⃣ Informações Básicas */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha as informações essenciais do produto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Eletrônicos</SelectItem>
                            <SelectItem value="2">Vestuário</SelectItem>
                            <SelectItem value="3">Alimentos</SelectItem>
                            <SelectItem value="4">Móveis</SelectItem>
                            <SelectItem value="5">Livros</SelectItem>
                            <SelectItem value="6">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input id='brand' placeholder="Marca do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código/SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="Código único do produto" {...field} />
                      </FormControl>
                      <FormDescription>Código único para identificação do produto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("other")}>
                  Pular para o final
                </Button>
                <Button type="button" onClick={() => setActiveTab("price")}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 2️⃣ Preço e Promoção */}
          <TabsContent value="price">
            <Card>
              <CardHeader>
                <CardTitle>Preço e Promoção</CardTitle>
                <CardDescription>Configure os preços e promoções do produto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Venda *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">R$</span>
                            <Input type="number" step="0.01" min="0" className="pl-10" placeholder="0,00" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_offer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Promocional</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">R$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="pl-10"
                              placeholder="0,00"
                              {...field}
                              value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date_create_promotion"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Início da Promoção</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
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
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_end_promotion"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Fim da Promoção</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
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
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="taxa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Taxa/Imposto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de imposto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="icms">ICMS</SelectItem>
                          <SelectItem value="iss">ISS</SelectItem>
                          <SelectItem value="ipi">IPI</SelectItem>
                          <SelectItem value="pis">PIS</SelectItem>
                          <SelectItem value="cofins">COFINS</SelectItem>
                          <SelectItem value="isento">Isento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("stock")}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 3️⃣ Estoque e Logística */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Estoque e Logística</CardTitle>
                <CardDescription>Informações sobre estoque e características físicas do produto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ammount_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade em Estoque *</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Mínimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Quantidade mínima"
                            {...field}
                            value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                          />
                        </FormControl>
                        <FormDescription>Quantidade para alerta de reposição</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="barscode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras (EAN/GTIN)</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de barras do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="heigther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.001"
                            placeholder="Peso em kg"
                            {...field}
                            value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}

                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="days_produtions_create"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo de Produção/Manuseio (dias)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Dias para produção"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>Tempo necessário para preparar o produto</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Altura"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Largura"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="depth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profundidade (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Profundidade"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("price")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("media")}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 4️⃣ Imagens e Mídias */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Imagens e Mídias</CardTitle>
                <CardDescription>Adicione imagens e vídeos do seu produto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="images">Imagens do Produto</Label>
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
                    >
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Clique para adicionar</span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>

                    {images.length > 0 && (
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative w-32 h-32 flex-shrink-0">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Remover imagem</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adicione até 10 imagens do produto. A primeira imagem será a principal.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-url">Vídeo do Produto (opcional)</Label>
                  <Input
                    id="video-url"
                    placeholder="Link do YouTube ou Vimeo"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Cole o link do vídeo do YouTube ou Vimeo</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("stock")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("variants")}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 5️⃣ Variantes */}
          <TabsContent value="variants">
            <Card>
              <CardHeader>
                <CardTitle>Variantes do Produto</CardTitle>
                <CardDescription>Adicione variações como tamanhos, cores ou outros atributos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Variantes do Produto</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Variante
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <div className="text-center py-8 border rounded-md bg-muted/20">
                      <p className="text-muted-foreground">
                        Nenhuma variante adicionada. Clique no botão acima para adicionar.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md relative"
                        >
                          <div>
                            <Label htmlFor={`attribute-${variant.id}`}>Atributo</Label>
                            <Select
                              value={variant.attribute}
                              onValueChange={(value) => updateVariant(variant.id, "attribute", value)}
                            >
                              <SelectTrigger id={`attribute-${variant.id}`}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cor">Cor</SelectItem>
                                <SelectItem value="tamanho">Tamanho</SelectItem>
                                <SelectItem value="material">Material</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`value-${variant.id}`}>Valor</Label>
                            <Input
                              id={`value-${variant.id}`}
                              placeholder="Ex: Azul, P, etc."
                              value={variant.value}
                              onChange={(e) => updateVariant(variant.id, "value", e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`price-${variant.id}`}>Preço</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">R$</span>
                              <Input
                                id={`price-${variant.id}`}
                                className="pl-10"
                                placeholder="0,00"
                                value={variant.price}
                                onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`stock-${variant.id}`}>Estoque</Label>
                            <Input
                              id={`stock-${variant.id}`}
                              type="number"
                              min="0"
                              placeholder="Quantidade"
                              value={variant.stock}
                              onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeVariant(variant.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Remover variante</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("media")}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setActiveTab("other")}>
                  Próximo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 6️⃣ Outras Informações */}
          <TabsContent value="other">
            <Card>
              <CardHeader>
                <CardTitle>Outras Informações</CardTitle>
                <CardDescription>Configurações adicionais e informações para SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Status do Produto: {field.value ? "Ativo" : "Inativo"}</FormLabel>
                          <FormDescription>Produto visível na loja quando ativo</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="is_main"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Destaque na Loja: {field.value ? "Sim" : "Não"}</FormLabel>
                          <FormDescription>Produto aparecerá em seções de destaque</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags ou Palavras-chave</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: camiseta, algodão, verão (separadas por vírgula)" {...field} />
                      </FormControl>
                      <FormDescription>Palavras-chave para busca e SEO interno</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição para SEO</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descrição para SEO (máx. 160 caracteres)"
                          className="resize-none"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>Meta descrição para melhorar a visibilidade em buscadores</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("variants")}>
                  Anterior
                </Button>

                <Button type="submit" disabled={isSubmitting}   onClick={() => {
                 try {
                  const forms = productSchema.parse(form.getValues())
                  console.log({forms});

                  onSubmit(forms)
                 } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Ops! Campos inválidos",
                    description: "Verifique os campos obrigattórios com * e tente novamente.",
                    action: <ToastAction altText="Try again">Fechar</ToastAction>,
                  })

                 }
                }}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Produto"
            )}
          </Button>
              
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}


