 
import { createClient } from "@/utils/supabase/server"


export async function getAllInvoices(): Promise<Invoices[]> {
    const supabase = await createClient()

    let { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')

    if (error) {
        console.log(error)
        return []
    }

    console.log({invoices})

    return invoices as Invoices[];
}
