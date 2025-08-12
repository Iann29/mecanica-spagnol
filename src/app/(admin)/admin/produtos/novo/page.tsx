import { ProductForm } from "@/components/admin/products/product-form"
import { Toaster } from "@/components/ui/sonner"

export default function AdminNovoProdutoPage() {
  return (
    <>
      <ProductForm mode="create" />
      <Toaster richColors position="top-right" />
    </>
  )
}
