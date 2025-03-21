import ProductRegistrationForm from "@/app/components/Products/CreateProduct";


interface Props {
    params: {
        id: string;
    }
}
export default async function EditProductByID ({params}: Props) {
    const { id } = await params;
 
    return (
       <ProductRegistrationForm product_id={id} />
    )

}