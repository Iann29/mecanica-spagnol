"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Plus, Trash2, GripVertical, Package, Edit, Save, X } from "lucide-react"
import type { ProductVariant } from "@/types/database"

interface VariantManagerProps {
  productId?: string
  baseSKU?: string
  basePrice?: number
  className?: string
}

interface VariantFormData {
  id?: string
  name: string
  value: string
  price_modifier: number
  stock_quantity: number
  sku_suffix: string
  is_active: boolean
  sort_order: number
}

const COMMON_VARIANT_TYPES = [
  'Tamanho',
  'Cor',
  'Capacidade',
  'Modelo',
  'Material',
  'Voltagem',
  'Potência'
]

export function VariantManager({ productId, baseSKU, basePrice = 0, className }: VariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<VariantFormData>({
    name: '',
    value: '',
    price_modifier: 0,
    stock_quantity: 0,
    sku_suffix: '',
    is_active: true,
    sort_order: 0
  })

  // Carregar variações existentes
  useEffect(() => {
    if (productId) {
      loadVariants()
    }
  }, [productId])

  const loadVariants = async () => {
    if (!productId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/produtos/${productId}/variants`)
      if (res.ok) {
        const data = await res.json()
        setVariants(data.data || [])
      }
    } catch (error) {
      console.error('Error loading variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      price_modifier: 0,
      stock_quantity: 0,
      sku_suffix: '',
      is_active: true,
      sort_order: variants.length
    })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    if (!productId) {
      toast.error('Salve o produto antes de adicionar variações')
      return
    }

    if (!formData.name.trim() || !formData.value.trim()) {
      toast.error('Nome e valor são obrigatórios')
      return
    }

    // Verificar duplicatas
    const exists = variants.some(v => 
      v.id !== editingId && 
      v.name.toLowerCase() === formData.name.toLowerCase() && 
      v.value.toLowerCase() === formData.value.toLowerCase()
    )

    if (exists) {
      toast.error('Já existe uma variação com este nome e valor')
      return
    }

    setLoading(true)
    try {
      const url = editingId 
        ? `/api/produtos/${productId}/variants/${editingId}`
        : `/api/produtos/${productId}/variants`
      
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao salvar variação')
      }

      toast.success(editingId ? 'Variação atualizada' : 'Variação criada')
      resetForm()
      loadVariants()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (variant: ProductVariant) => {
    setFormData({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      price_modifier: variant.price_modifier,
      stock_quantity: variant.stock_quantity,
      sku_suffix: variant.sku_suffix || '',
      is_active: variant.is_active,
      sort_order: variant.sort_order
    })
    setEditingId(variant.id)
  }

  const handleDelete = async (id: string) => {
    if (!productId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/produtos/${productId}/variants/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao excluir variação')
      }

      toast.success('Variação excluída')
      setDeleteId(null)
      loadVariants()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getFinalPrice = (priceModifier: number) => {
    return basePrice + priceModifier
  }

  const generateSKUSuffix = (name: string, value: string) => {
    const nameCode = name.substring(0, 3).toUpperCase()
    const valueCode = value.substring(0, 3).toUpperCase()
    return `${nameCode}-${valueCode}`
  }

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Variações do Produto</h3>
          <p className="text-sm text-muted-foreground">
            Configure diferentes variações como tamanhos, cores, etc.
          </p>
        </div>
      </div>

      {!productId && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="font-medium">Produto não salvo</p>
          <p className="text-sm">Salve o produto primeiro para adicionar variações</p>
        </div>
      )}

      {productId && (
        <div className="space-y-6">
          {/* Form para adicionar/editar variação */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {editingId ? 'Editar Variação' : 'Nova Variação'}
              </h4>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Variação</Label>
                <Select 
                  value={formData.name} 
                  onValueChange={(value) => setFormData({ ...formData, name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_VARIANT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Ou digite um tipo personalizado"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Valor</Label>
                <Input
                  placeholder="ex: Grande, Azul, 500ml"
                  value={formData.value}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData({ 
                      ...formData, 
                      value,
                      sku_suffix: formData.sku_suffix || generateSKUSuffix(formData.name, value)
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Modificador de Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price_modifier}
                  onChange={(e) => setFormData({ ...formData, price_modifier: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Preço final: R$ {getFinalPrice(formData.price_modifier).toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Estoque</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Sufixo SKU</Label>
                <Input
                  placeholder="ex: -GRD, -AZL"
                  value={formData.sku_suffix}
                  onChange={(e) => setFormData({ ...formData, sku_suffix: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  SKU final: {baseSKU}{formData.sku_suffix ? `-${formData.sku_suffix}` : ''}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label>Variação ativa</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </Card>

          {/* Lista de variações */}
          {variants.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h4 className="font-medium mb-4">Variações Cadastradas ({variants.length})</h4>
                
                <ScrollArea className="max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className="font-medium">{variant.name}</TableCell>
                          <TableCell>{variant.value}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {baseSKU}{variant.sku_suffix ? `-${variant.sku_suffix}` : ''}
                          </TableCell>
                          <TableCell>
                            {variant.price_modifier !== 0 && (
                              <span className={cn(
                                "text-xs mr-1",
                                variant.price_modifier > 0 ? "text-red-600" : "text-green-600"
                              )}>
                                {variant.price_modifier > 0 ? '+' : ''}R$ {variant.price_modifier.toFixed(2)}
                              </span>
                            )}
                            <span className="font-medium">
                              R$ {getFinalPrice(variant.price_modifier).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>{variant.stock_quantity}</TableCell>
                          <TableCell>
                            <Badge variant={variant.is_active ? "default" : "secondary"}>
                              {variant.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(variant)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(variant.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta variação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}