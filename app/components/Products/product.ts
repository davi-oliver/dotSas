import { supabase } from "@/utils/supabase/server"


/**
 * Função para fazer upload de uma imagem para o storage do Supabase
 * @param file Arquivo de imagem
 * @param productSku SKU do produto para organização das pastas
 * @returns URL da imagem ou null em caso de erro
 */
export const uploadProductImage = async (file: File, productSku: string): Promise<string | null> => {
  try {
    // Gera um nome único para o arquivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${productSku}_${Date.now()}.${fileExt}`
    const filePath = `products/${productSku}/${fileName}`

    // Faz o upload do arquivo
    const { data, error } = await (await supabase).storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      return null
    }

    // Retorna a URL pública da imagem
    const { data: urlData } = (await supabase).storage.from("product-images").getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Erro ao processar upload da imagem:", error)
    return null
  }
}

/**
 * Função para cadastrar um produto no Supabase
 * @param product Dados do produto a ser cadastrado
 * @param imageFiles Arquivos de imagem para upload
 * @returns Objeto com status de sucesso, dados ou erro
 */
export const createProduct = async ( formData: FormData ): Promise<void> => {
  try {
    const product: ProductInsert = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        brand: formData.get("brand") as string,
        sku: formData.get("sku") as string,
        price: Number(formData.get("price")),
        promotional_price: Number(formData.get("promotional_price")),
        promotion_start: formData.get("date_create_promotion") ? new Date(formData.get("date_create_promotion") as string) : null,
        promotion_end: formData.get("date_end_promotion") ? new Date(formData.get("date_end_promotion") as string) : null,
        tax_type: formData.get("tax_type") as string,
        stock: Number(formData.get("stock")),
        min_stock: Number(formData.get("min_stock")),
        barcode: formData.get("barcode") as string,
        weight: Number(formData.get("weight")),
        height: Number(formData.get("height")),
        width: Number(formData.get("width")),
        depth: Number(formData.get("depth")),
        production_time: Number(formData.get("production_time")),
        status: formData.get("status") === "true",
        featured: formData.get("featured") === "true",
        tags: formData.get("tags") as string,
        seo_description: formData.get("seo_description") as string,
        video_url: formData.get("video_url") as string,
    }
     

    // Faz upload das imagens, se houver
    let imageUrls: string[] = []

    // if (imageFiles && imageFiles.length > 0) {
    //   const uploadPromises = imageFiles.map((file) => uploadProductImage(file, product.sku))
    //   const results = await Promise.all(uploadPromises)

    //   // Filtra resultados nulos (falhas de upload)
    //   imageUrls = results.filter((url) => url !== null) as string[]
    // }

    // Adiciona as URLs das imagens ao produto
    const productToInsert = {
      ...product,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      // Converte datas para o formato ISO
      promotion_start: product.promotion_start ? new Date(product.promotion_start).toISOString() : null,
      promotion_end: product.promotion_end ? new Date(product.promotion_end).toISOString() : null,
      // Converte variantes para JSON se existirem
      variants: product.variants ? JSON.stringify(product.variants) : null,
    }

    // Insere o produto na tabela
    const { data, error } = await (await supabase).from("product").insert(productToInsert).select().single()

    if (error) {
      console.error("Erro ao cadastrar produto:", error)
       throw new Error(error.message)
    }

     
  } catch (error) {
    console.error("Erro ao processar cadastro do produto:", error)
    
  }
}

/**
 * Função para buscar todos os produtos
 * @returns Lista de produtos ou erro
 */
export const getProducts = async (): Promise<ProductInsertResponse> => {
  try {
    const { data, error } = await (await supabase).from("product").select("*").order("created_at", { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao buscar produtos",
    }
  }
}

/**
 * Função para buscar um produto pelo ID
 * @param id ID do produto
 * @returns Dados do produto ou erro
 */
export const getProductById = async (id: string): Promise<ProductInsertResponse> => {
  try {
    const { data, error } = await (await supabase).from("product").select("*").eq("id", id).single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao buscar produto",
    }
  }
}

/**
 * Função para atualizar um produto
 * @param id ID do produto
 * @param product Dados atualizados do produto
 * @param imageFiles Novos arquivos de imagem para upload
 * @returns Status da operação
 */
export const updateProduct = async (
  id: string,
  product: Partial<ProductInsert>,
  imageFiles?: File[],
): Promise<ProductInsertResponse> => {
  try {
    // Faz upload das novas imagens, se houver
    let newImageUrls: string[] = []

    if (imageFiles && imageFiles.length > 0) {
      const uploadPromises = imageFiles.map((file) => uploadProductImage(file, product.sku || "update"))
      const results = await Promise.all(uploadPromises)

      // Filtra resultados nulos (falhas de upload)
      newImageUrls = results.filter((url) => url !== null) as string[]
    }

    // Prepara os dados para atualização
    const productToUpdate: any = {
      ...product,
      // Adiciona novas imagens se houver
      ...(newImageUrls.length > 0 && {
        images: product.images ? [...product.images, ...newImageUrls] : newImageUrls,
      }),
      // Converte datas para o formato ISO
      ...(product.promotion_start && {
        promotion_start: new Date(product.promotion_start).toISOString(),
      }),
      ...(product.promotion_end && {
        promotion_end: new Date(product.promotion_end).toISOString(),
      }),
      // Converte variantes para JSON se existirem
      ...(product.variants && {
        variants: JSON.stringify(product.variants),
      }),
    }

    // Atualiza o produto na tabela
    const { data, error } = await (await supabase).from("product").update(productToUpdate).eq("id", id).select().single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao atualizar produto",
    }
  }
}

/**
 * Função para excluir um produto
 * @param id ID do produto
 * @returns Status da operação
 */
export const deleteProduct = async (id: string): Promise<ProductInsertResponse> => {
  try {
    // Primeiro, busca o produto para obter informações sobre imagens
    const { data: product, error: fetchError } = await (await supabase).from("product").select("*").eq("id", id).single()

    if (fetchError) {
      return {
        success: false,
        error: fetchError.message,
      }
    }

    // Exclui o produto
    const { error } = await (await supabase).from("product").delete().eq("id", id)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Opcionalmente, pode-se implementar a exclusão das imagens do storage aqui
    // Isso exigiria extrair os caminhos das imagens e usar supabase.storage.from('product-images').remove([paths])

    return {
      success: true,
      data: { id },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao excluir produto",
    }
  }
}




// Tipagem para a tabela de produtos
export type ProductInsert = {
    name: string
    description?: string
    category: string
    brand?: string
    sku: string
    price: number
    promotional_price?: number
    promotion_start?: Date | null
    promotion_end?: Date | null
    tax_type?: string
    stock: number
    min_stock?: number
    barcode?: string
    weight?: number
    height?: number
    width?: number
    depth?: number
    production_time?: number
    status: boolean
    featured: boolean
    tags?: string
    seo_description?: string
    images?: string[] // URLs das imagens após upload
    video_url?: string
    variants?: ProductVariant[]
  }
  
  // Tipagem para variantes do produto
  export type ProductVariant = {
    attribute: string
    value: string
    price: number
    stock: number
  }
  
  // Tipagem para resposta da função de cadastro
  export type ProductInsertResponse = {
    success: boolean
    data?: any
    error?: string
  }
  
  