import { ProductForm } from "@/components/admin/products/product-form"
import { Toaster } from "@/components/ui/sonner"

export default function AdminEditarProdutoPage({ params }: { params: { id: string } }) {
  return (
    <>
      <ProductForm mode="edit" productId={params.id} />
      <Toaster richColors position="top-right" />
    </>
  )
}
