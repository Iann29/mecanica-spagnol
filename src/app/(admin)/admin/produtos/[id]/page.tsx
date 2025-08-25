import { ProductForm } from "@/components/admin/products/product-form"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminEditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <ProductForm mode="edit" productId={id} />
      <Toaster richColors position="top-right" />
    </>
  )
}
