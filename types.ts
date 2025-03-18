
interface Product {
    id: number;
    created_at: string; // ISO date string
    name: string;
    description: string;
    category_id: number | null;
    brand: string;
    sku: string;
    price_offer: number;
    price: number;
    date_create_promotion: string; // ISO date string
    date_end_promotion: string; // ISO date string
    taxa: number;
    ammount_stock: number;
    min_stock: number;
    barscode: string;
    heigther: number; // Possível erro de digitação, talvez seja "height"?
    days_produtions_create: number;
    heigth: number; // Possível duplicação de "heigther"
    width: number;
    depth: number;
    link_product: string | null;
    active: boolean;
    is_main: boolean;
    tags: string[] | null;
    seo: string | null;
    images: ProductImage;
  }

  // Tipos
interface ProductImage {
    id: string
    url: string
    isMain: boolean
  }
  
  interface ProductVariant {
    id: string
    attribute: string
    value: string
    price: number
    stock: number
  }
  