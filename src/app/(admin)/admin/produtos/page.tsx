import { ProductsTable } from "@/components/admin/products/products-table"
import { Toaster } from "@/components/ui/sonner"

export default function AdminProdutosPage() {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
        <p className="text-sm text-muted-foreground">Gerencie os produtos da loja</p>
      </div>
      <ProductsTable />
      <Toaster richColors position="top-right" />
    </div>
  )
}
