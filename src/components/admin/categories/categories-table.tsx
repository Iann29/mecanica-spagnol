"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, Plus, Trash2, Pencil, RefreshCw, Package } from "lucide-react"

interface CategoryItem {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

interface ApiListResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}

export function CategoriesTable({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const [q, setQ] = useState(params.get("q") ?? "")
  const [isActive, setIsActive] = useState(params.get("is_active") ?? "all")
  const [page, setPage] = useState(Number(params.get("page") ?? 1))
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 10))
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CategoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      sp.set("page", String(page))
      sp.set("pageSize", String(pageSize))
      if (q) sp.set("q", q)
      if (isActive === "true" || isActive === "false") sp.set("is_active", isActive)
      sp.set("sort", "name.asc")
      const res = await fetch(`/api/categorias?${sp.toString()}`, { cache: "no-store" })
      
      if (!res.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      
      const json: ApiListResponse<CategoryItem> = await res.json()
      setRows(json.data)
      setTotal(json.total)
    } catch (e: unknown) {
      toast.error("Falha ao carregar categorias")
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
    const url = qs ? `/admin/categorias?${qs}` : "/admin/categorias"
    window.history.replaceState(null, "", url)
  }, [q, isActive, page, pageSize])

  const onDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? "Falha ao excluir")
      }
      toast.success("Categoria excluída")
      setDeleteId(null)
      load()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Falha ao excluir"
      toast.error(errorMessage)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Buscar por nome ou descrição"
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
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Ativas</SelectItem>
              <SelectItem value="false">Inativas</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>

        <Link href="/admin/categorias/nova">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Categoria</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                      <p>Nenhuma categoria encontrada</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {c.image_url && (
                        <div className="w-10 h-10 rounded border overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{c.slug}</TableCell>
                  <TableCell className="max-w-xs">
                    {c.description ? (
                      <span className="line-clamp-2 text-sm text-muted-foreground">{c.description}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">Sem descrição</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/categorias/${c.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="h-4 w-4" /> Editar
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="gap-1" 
                        onClick={() => setDeleteId(c.id)}
                      >
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
          Página {page} de {totalPages} • {total} registro{total !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page <= 1} 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= totalPages} 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Próxima
          </Button>

          <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)) }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
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
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta categoria?
              {deleteId && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Nota:</strong> Só é possível excluir categorias que não possuem produtos.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && onDelete(deleteId)} 
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}