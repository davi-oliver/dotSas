export interface Corporate {
  id?: number;
  created_at?: string; // ISO timestamp format
  trade_name: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address_id?: number | null; 
  indentify?: number | null;
  type_document?: string | null;
  logo: string | null;
  social_name?: string | null;
  
  address?: {
    street?: string ;
    number?: string ;
    neighborhood?: string ;
    city?: string ;
    state?: string;
    country?: string ;
    complement?: string ;
    zipCode?: string ;
  },
}


export interface Member {
    id: string
    name: string
    email: string
    role: "owner" | "admin" | "member" | "guest"
    avatar?: string
    status: "active" | "invited" | "suspended"
    joinedAt: string
  }
