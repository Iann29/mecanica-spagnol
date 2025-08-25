import { CategoryForm } from "@/components/admin/categories/category-form"
import { Toaster } from "@/components/ui/sonner"

interface AdminEditCategoriaProps {
  params: {
    id: string
  }
}

export default function AdminEditCategoria({ params }: AdminEditCategoriaProps) {
  return (
    <>
      <CategoryForm mode="edit" categoryId={params.id} />
      <Toaster richColors position="top-right" />
    </>
  )
}