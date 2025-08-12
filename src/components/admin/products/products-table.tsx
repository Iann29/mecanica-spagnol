"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, Plus, Trash2, Pencil, RefreshCw } from "lucide-react"

interface ProductItem {
  id: string
  sku: string
  name: string
  price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
}

interface ApiListResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}

export function ProductsTable({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const [q, setQ] = useState(params.get("q") ?? "")
  const [isActive, setIsActive] = useState(params.get("is_active") ?? "all")
  const [page, setPage] = useState(Number(params.get("page") ?? 1))
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 10))
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ProductItem[]>([])
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      sp.set("page", String(page))
      sp.set("pageSize", String(pageSize))
      if (q) sp.set("q", q)
      if (isActive === "true" || isActive === "false") sp.set("is_active", isActive)
      sp.set("sort", "created_at.desc")
      const res = await fetch(`/api/produtos?${sp.toString()}`, { cache: "no-store" })
      const json: ApiListResponse<ProductItem> = await res.json()
      setRows(json.data)
      setTotal(json.total)
    } catch (e: any) {
      toast.error("Falha ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }, [q, isActive, page, pageSize])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const sp = new URLSearchParams()
    if (q) sp.set("q", q)
    if (isActive !== "all") sp.set("is_active", isActive)
    sp.set("page", String(page))
    sp.set("pageSize", String(pageSize))
    const qs = sp.toString()
    const url = qs ? `/admin/produtos?${qs}` : "/admin/produtos"
    window.history.replaceState(null, "", url)
  }, [q, isActive, page, pageSize])

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Falha ao excluir")
      toast.success("Produto excluído")
      setDeleteId(null)
      load()
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao excluir")
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Buscar por nome ou SKU"
            value={q}
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
            }}
            className="w-full md:w-[320px]"
          />

          <Select value={isActive} onValueChange={(v) => { setPage(1); setIsActive(v) }}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>

        <Link href="/admin/produtos/novo">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="text-right">R$ {p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.stock_quantity}</TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 rounded text-xs", p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700")}>{p.is_active ? "Ativo" : "Inativo"}</span>
                  </TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/produtos/${p.id}`}>
                        <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-4 w-4" /> Editar</Button>
                      </Link>
                      <Button variant="destructive" size="sm" className="gap-1" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" /> Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages} • {total} registros
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Próxima
          </Button>

          <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)) }}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Itens/pág" /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} por página</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir o produto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && onDelete(deleteId)} className="bg-destructive text-destructive-foreground hover:opacity-90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
