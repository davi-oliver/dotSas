import { createClient } from "@/utils/supabase/server";

 


export async function getAllProducts(): Promise<Product[]> {
    const supabase = await createClient ()

    let { data: product, error } = await supabase
    .from('product')
    .select('*')

    if (error) {
        console.log(error)
        return []
    }

    console.log({product})

    return product as Product[]; 

}

export async function getAllCategory(): Promise<any[]> {
    const supabase = await createClient ()

    let { data: categories, error } = await supabase
    .from('category')
    .select('*')

    if (error) {
        console.log(error)
        return []
    }

    console.log({categories})

    return categories as any[]; 

}

export async function findFileById(id: string) {

    const supabase = await createClient ()

    // busca em product_media os path name de cada produto

    let { data: products_media, error: error_media } = await supabase
    .from('products_media')
    .select('path_name').eq('product_id', id)
    
    if (error_media) {
        console.log(error_media)
    }

    console.log({products_media})

    return products_media;

}


export async function findProductById(id: string) {

    const supabase = await createClient ()

    let { data: product, error } = await supabase
    .from('product')
    .select('*').eq('id', id)

    if (error) {
        console.log(error)
    }

    console.log({product})

    return product;

}
