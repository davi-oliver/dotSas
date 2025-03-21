"use client"

import { useState, useEffect } from "react"
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useMediaQuery } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter } from "next/navigation"


// Componente principal
export default function ProductList({ items, categories }: { items: Product[], categories: any[] }) {
  const [products, setProducts] = useState<Product[]>(items)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(items)
  const [categorieslist, setCategorielist] = useState<any[]>(categories)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const isMobile = useMediaQuery("(max-width: 768px)")
  const itemsPerPage = 5


  const router = useRouter()
  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...products]

    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Aplicar filtro de categoria
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category_id === categorieslist.find((category) => category.name === categoryFilter)?.id)
    }

    // Aplicar filtro de estoque
    if (stockFilter === "inStock") {
      result = result.filter((product) => product.ammount_stock > 0)
    } else if (stockFilter === "outOfStock") {
      result = result.filter((product) => product.ammount_stock === 0)
    } else if (stockFilter === "lowStock") {
      result = result.filter((product) => product.min_stock !== undefined && product.ammount_stock <= product.min_stock)
    }

    // Aplicar filtro de status
    if (statusFilter === "active") {
      result = result.filter((product) => product.active)
    } else if (statusFilter === "inactive") {
      result = result.filter((product) => !product.active)
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      let valueA: any = a[sortField as keyof Product]
      let valueB: any = b[sortField as keyof Product]

      // Tratamento especial para campos específicos
      if (sortField === "category") {
        valueA = categorieslist.find((category) => category.id === a.category_id)?.name || a.category_id
        valueB = categorieslist.find((category) => category.id === b.category_id)?.name || b.category_id
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, stockFilter, statusFilter, sortField, sortDirection, products])

  // Alternar direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setStockFilter("all")
    setStatusFilter("all")
    setIsFilterOpen(false)
  }

  // Formatar valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Manipular seleção de itens
  const toggleItemSelection = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedProducts.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedProducts.map((product) => product.id).filter((id): id is number => id !== undefined))
    }
  }

  // Simular exclusão de produto
  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
    setSelectedItems((prev) => prev.filter((item) => item !== id))
    setIsDeleteDialogOpen(false)
  }

  // Simular exclusão em massa
  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((product) => !selectedItems.filter((id) => id !== undefined).includes(product.id!)))
    setSelectedItems([])
    setIsDeleteDialogOpen(false)
  }

  // handleClickEdit 
  const handleClickEdit = (id: number) => {
    console.log(`Editando produto ${id}`)
    router.push(`/products/edit/${id}`)  
  }

  // Componente de detalhes do produto para desktop
  const ProductDetailsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogDescription>Informações completas do produto</DialogDescription>
        </DialogHeader>
        <ProductDetailsContent />
      </DialogContent>
    </Dialog>
  )

  // Componente de detalhes do produto para mobile
  const ProductDetailsDrawer = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalhes do Produto</DrawerTitle>
          <DrawerDescription>Informações completas do produto</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(80vh-10rem)] px-4">
          <ProductDetailsContent />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  // Conteúdo dos detalhes do produto
  const ProductDetailsContent = () => {
    if (!selectedProduct) return null

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* <div className="sm:w-1/3">
            <div className="aspect-square rounded-md overflow-hidden border">
              <img
                src={selectedProduct.images?.url || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div key={selectedProduct.images.id} className="aspect-square rounded-md overflow-hidden border">
                    <img
                      src={selectedProduct.images.url || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
          </div> */}

          <div className="sm:w-2/3 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
              </div>
              <Badge variant={selectedProduct.active ? "default" : "secondary"}>
                {selectedProduct.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                {selectedProduct.price_offer ? (
                  <>
                    <span className="text-xl font-bold">{formatCurrency(selectedProduct.price_offer)}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold">{formatCurrency(selectedProduct.price)}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={selectedProduct.ammount_stock > 0 ? "outline" : "destructive"}>
                  {selectedProduct.ammount_stock > 0 ? `${selectedProduct.ammount_stock} em estoque` : "Fora de estoque"}
                </Badge>
                {selectedProduct.is_main && <Badge variant="secondary">Destaque</Badge>}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-sm">{selectedProduct.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Categoria</h3>
                <p className="text-sm">
                  { selectedProduct.name}
                </p>
              </div>

              {selectedProduct.brand && (
                <div>
                  <h3 className="font-medium mb-2">Marca</h3>
                  <p className="text-sm">{selectedProduct.brand}</p>
                </div>
              )}
            </div>

            {/* {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Variantes</h3>
                  <div className="space-y-2">
                    {selectedProduct.variants.map((variant) => (
                      <div key={variant.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div>
                          <span className="text-sm font-medium">
                            {variant.attribute}: {variant.value}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatCurrency(variant.price)}</div>
                          <div className="text-xs text-muted-foreground">Estoque: {variantammount_stock}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )} */}
          </div>
        </div>
      </div>
    )
  }

  // Componente de filtros para desktop
  const FiltersPopover = () => (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filtrar Produtos</h4>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                <SelectItem value="vestuario">Vestuário</SelectItem>
                <SelectItem value="eletrodomesticos">Eletrodomésticos</SelectItem>
                <SelectItem value="utensilios">Utensílios</SelectItem>
                <SelectItem value="moveis">Móveis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger id="stock">
                <SelectValue placeholder="Todos os produtos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="inStock">Em estoque</SelectItem>
                <SelectItem value="outOfStock">Fora de estoque</SelectItem>
                <SelectItem value="lowStock">Estoque baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
            <Button size="sm" onClick={() => setIsFilterOpen(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  // Componente de filtros para mobile
  const FiltersDrawer = () => (
    <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar Produtos</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-mobile">Categoria</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-mobile">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                <SelectItem value="vestuario">Vestuário</SelectItem>
                <SelectItem value="eletrodomesticos">Eletrodomésticos</SelectItem>
                <SelectItem value="utensilios">Utensílios</SelectItem>
                <SelectItem value="moveis">Móveis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-mobile">Estoque</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger id="stock-mobile">
                <SelectValue placeholder="Todos os produtos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="inStock">Em estoque</SelectItem>
                <SelectItem value="outOfStock">Fora de estoque</SelectItem>
                <SelectItem value="lowStock">Estoque baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-mobile">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-mobile">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  // Diálogo de confirmação de exclusão
  const DeleteConfirmationDialog = ({ id }: { id?: number }) => (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            {id
              ? "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
              : `Tem certeza que deseja excluir ${selectedItems.length} produtos selecionados? Esta ação não pode ser desfeita.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => (id ? handleDeleteProduct(id) : handleBulkDelete())}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerencie seu catálogo de produtos</CardDescription>
          </div>
          <Button className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <Link href="/products/new">Novo Produto</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Limpar busca</span>
                </Button>
              )}
            </div>
            <div className="flex gap-2 self-end">
              {isMobile ? <FiltersDrawer /> : <FiltersPopover />}

              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="stock">Estoque</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="createdAt">Data de Criação</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleSortDirection}>
                {sortDirection === "asc" ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
                <span className="sr-only">{sortDirection === "asc" ? "Ordem crescente" : "Ordem decrescente"}</span>
              </Button>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="bg-muted/50 p-2 rounded-md flex items-center justify-between">
              <span className="text-sm">
                {selectedItems.length} {selectedItems.length === 1 ? "produto selecionado" : "produtos selecionados"}
              </span>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Selecionados
              </Button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tente ajustar os filtros ou criar um novo produto.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              {/* Versão para desktop */}
              <div className="hidden md:block border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={paginatedProducts.length > 0 && selectedItems.length === paginatedProducts.length}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Selecionar todos"
                        />
                      </TableHead>
                      <TableHead className="w-[80px]">Imagem</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={product.id !== undefined && selectedItems.includes(product.id)}
                            onCheckedChange={() => product.id !== undefined && toggleItemSelection(product.id)}
                            aria-label={`Selecionar ${product.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            <img
                              src={product.images?.url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell>
                          {selectedProduct?.category_id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={product.ammount_stock === 0 ? "text-destructive" : ""}>{product.ammount_stock}</span>
                            {product.min_stock !== undefined && product.ammount_stock <= product.min_stock && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Baixo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.price_offer ? (
                            <div className="space-y-1">
                              <div className="font-medium">{formatCurrency(product.price_offer)}</div>
                              <div className="text-xs text-muted-foreground line-through">
                                {formatCurrency(product.price)}
                              </div>
                            </div>
                          ) : (
                            formatCurrency(product.price)
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.active}
                            aria-label="Toggle status"
                            onCheckedChange={(checked) => {
                              setProducts((prev) =>
                                prev.map((p) => (p.id === product.id ? { ...p, status: checked } : p)),
                              )
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div onClick={() => setSelectedProduct(product)}>
                              <ProductDetailsDialog />
                            </div>
                            <Button variant="ghost" size="icon">
                             <Link href='products/edit'> <Edit className="h-4 w-4" /></Link>
                             
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Mais opções</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setProducts((prev) =>
                                      prev.map((p) => (p.id === product.id ? { ...p, featured: !p.is_main } : p)),
                                    )
                                  }}
                                >
                                  {product.is_main ? "Remover destaque" : "Destacar produto"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setProducts((prev) =>
                                      prev.map((p) => (p.id === product.id ? { ...p, status: !p.active } : p)),
                                    )
                                  }}
                                >
                                  {product.active ? "Desativar produto" : "Ativar produto"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setIsDeleteDialogOpen(true)
                                    setSelectedProduct(product)
                                  }}
                                >
                                  Excluir produto
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Versão para mobile */}
              <div className="md:hidden space-y-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={product.id !== undefined && selectedItems.includes(product.id)}
                        onCheckedChange={() => product.id !== undefined && toggleItemSelection(product.id)}
                        aria-label={`Selecionar ${product.name}`}
                      />
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={product.images?.url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {product.category_id}
                          </Badge>
                          {product.is_main && <Badge variant="secondary">Destaque</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {product.price_offer
                            ? formatCurrency(product.price_offer)
                            : formatCurrency(product.price)}
                        </div>
                        <div className="text-sm">
                          Estoque:
                          <span className={product.ammount_stock === 0 ? "text-destructive ml-1" : "ml-1"}>
                            {product.ammount_stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <div onClick={() => setSelectedProduct(product)}>
                          <ProductDetailsDrawer />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => {
                          {product.id !== undefined && handleClickEdit(product.id)}
                        }}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mais opções</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setProducts((prev) =>
                                  prev.map((p) => (p.id === product.id ? { ...p, status: !p.active } : p)),
                                )
                              }}
                            >
                              {product.active ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setProducts((prev) =>
                                  prev.map((p) => (p.id === product.id ? { ...p, featured: !p.active } : p)),
                                )
                              }}
                            >
                              {product.is_main ? "Remover destaque" : "Destacar"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setIsDeleteDialogOpen(true)
                                setSelectedProduct(product)
                              }}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Paginação */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próxima página</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmationDialog id={selectedProduct?.id} />
    </Card>
  )
}

