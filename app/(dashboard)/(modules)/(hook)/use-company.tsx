import { createClient } from "@/utils/supabase/server";


 async function getCompanyByUser(user_id: number ){
    const supabase = await createClient();
    const {data, error} = await supabase.from('user_corporate').select('*').eq('user_id', user_id);

    if (error) {
        console.log(error)
        return {}
    }
    
    if(!data) return {};

        let companyByUser: any = [];
        data.forEach(async (element: any) => {

        const {data: companyData, error: companyError} = await supabase.from('company').select('*').eq('id', element.company_id);
        if (companyError) {
            console.log(companyError)
            return {}
        }
        console.log(companyData)
        companyByUser.push(companyData)
    })
    console.log({companyByUser})
    return companyByUser;

 
 }