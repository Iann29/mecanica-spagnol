"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { ImportModal } from "./import-modal"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, Plus, Trash2, Pencil, RefreshCw, CheckSquare, Square, Eye, EyeOff, Download, Upload } from "lucide-react"

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<string>("")
  const [bulkLoading, setBulkLoading] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

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

  // Bulk operations functions
  const toggleSelectAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rows.map(r => r.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const executeBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return

    setBulkLoading(true)
    try {
      const res = await fetch('/api/produtos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          ids: Array.from(selectedIds)
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? 'Erro na operação em lote')
      }

      const result = await res.json()
      toast.success(`${result.count} produto${result.count !== 1 ? 's' : ''} ${getBulkActionLabel(bulkAction)}`)
      
      setSelectedIds(new Set())
      setBulkAction("")
      load()
    } catch (e: any) {
      toast.error(e.message ?? 'Falha na operação em lote')
    } finally {
      setBulkLoading(false)
    }
  }

  const getBulkActionLabel = (action: string) => {
    switch (action) {
      case 'activate': return 'ativado(s)'
      case 'deactivate': return 'desativado(s)' 
      case 'delete': return 'excluído(s)'
      default: return 'processado(s)'
    }
  }

  // Reset selection when data changes
  useEffect(() => {
    setSelectedIds(new Set())
  }, [rows])

  // Export function
  const handleExport = async () => {
    setExportLoading(true)
    try {
      const sp = new URLSearchParams()
      if (isActive === "true" || isActive === "false") sp.set("is_active", isActive)
      sp.set("format", "csv")
      
      const url = `/api/produtos/export?${sp.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.error ?? 'Erro ao exportar produtos')
      }
      
      // Download do arquivo
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `produtos-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      toast.success('Produtos exportados com sucesso!')
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao exportar produtos')
    } finally {
      setExportLoading(false)
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

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={exportLoading}
            className="gap-2"
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar CSV
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setImportModalOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>
          
          <Link href="/admin/produtos/novo">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Produto</Button>
          </Link>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selecionado{selectedIds.size !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Escolher ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ativar produtos
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Desativar produtos
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Excluir produtos
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={executeBulkAction} 
                disabled={!bulkAction || bulkLoading}
                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              >
                {bulkLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  'Executar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedIds(new Set())}
                disabled={bulkLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={rows.length > 0 && selectedIds.size === rows.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id} className={selectedIds.has(p.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(p.id)}
                      onCheckedChange={() => toggleSelect(p.id)}
                      aria-label={`Selecionar ${p.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-right">R$ {p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.stock_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={p.is_active ? "default" : "secondary"}>
                      {p.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/produtos/${p.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="h-4 w-4" /> Editar
                        </Button>
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

      <ImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen}
        onSuccess={() => {
          setImportModalOpen(false)
          load()
        }}
      />
    </div>
  )
}
