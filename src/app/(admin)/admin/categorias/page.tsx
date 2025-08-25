import { CategoriesTable } from "@/components/admin/categories/categories-table"
import { Toaster } from "@/components/ui/sonner"

export default function AdminCategoriasPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
        <p className="text-sm text-muted-foreground">Gerencie as categorias dos produtos</p>
      </div>
      <CategoriesTable />
      <Toaster richColors position="top-right" />
    </div>
  )
}