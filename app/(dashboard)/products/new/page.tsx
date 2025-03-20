 
import ProductRegistrationForm from "@/app/components/Products/CreateProduct";
import { z } from "zod";
import { createProduct } from "../../(modules)/(hook)/use-product";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NewProduct () {

  

     
    return (
        <ProductRegistrationForm  />
    )
}