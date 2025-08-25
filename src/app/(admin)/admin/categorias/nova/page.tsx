import { CategoryForm } from "@/components/admin/categories/category-form"
import { Toaster } from "@/components/ui/sonner"

export default function AdminNovaCategoria() {
  return (
    <>
      <CategoryForm mode="create" />
      <Toaster richColors position="top-right" />
    </>
  )
}