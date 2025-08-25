"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Plus, Trash2, Search, Link2, Package, Check, ChevronsUpDown, X } from "lucide-react"
import type { RelatedProduct, Product } from "@/types/database"

interface RelatedProductsSelector {
  productId?: string
  currentProductName?: string
  className?: string
}

interface ProductOption {
  id: string
  name: string
  sku: string
  price: number
  category_name?: string
}

interface RelatedProductWithDetails extends RelatedProduct {
  related_product?: Product & { category?: { name: string } }
}

const RELATION_TYPES = [
  { value: 'related', label: 'Relacionado', description: 'Produtos similares ou complementares' },
  { value: 'accessory', label: 'Acessório', description: 'Acessórios para este produto' },
  { value: 'substitute', label: 'Substituto', description: 'Produtos que podem substituir este' },
  { value: 'upgrade', label: 'Upgrade', description: 'Versões superiores deste produto' }
] as const

export function RelatedProductsSelector({ productId, currentProductName, className }: RelatedProductsSelector) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProductWithDetails[]>([])
  const [availableProducts, setAvailableProducts] = useState<ProductOption[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null)
  const [relationType, setRelationType] = useState<'related' | 'accessory' | 'substitute' | 'upgrade'>('related')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Carregar produtos relacionados existentes
  useEffect(() => {
    if (productId) {
      loadRelatedProducts()
    }
  }, [productId])

  // Carregar produtos disponíveis para seleção
  useEffect(() => {
    loadAvailableProducts()
  }, [])

  const loadRelatedProducts = async () => {
    if (!productId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/produtos/${productId}/related`)
      if (res.ok) {
        const data = await res.json()
        setRelatedProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error loading related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableProducts = async () => {
    try {
      const res = await fetch('/api/produtos?pageSize=100&is_active=true')
      if (res.ok) {
        const data = await res.json()
        const products: ProductOption[] = (data.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          category_name: p.category?.name
        }))
        setAvailableProducts(products)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!searchValue) return availableProducts
    
    const search = searchValue.toLowerCase()
    return availableProducts.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search)
    )
  }, [availableProducts, searchValue])

  const handleAddRelation = async () => {
    if (!productId || !selectedProduct) {
      toast.error('Selecione um produto para relacionar')
      return
    }

    // Verificar se já existe esta relação
    const exists = relatedProducts.some(rp => 
      rp.related_product_id === selectedProduct.id && rp.relation_type === relationType
    )

    if (exists) {
      toast.error('Esta relação já existe')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/produtos/${productId}/related`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          related_product_id: selectedProduct.id,
          relation_type: relationType,
          sort_order: relatedProducts.length
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao adicionar produto relacionado')
      }

      toast.success('Produto relacionado adicionado')
      setSelectedProduct(null)
      setSearchValue("")
      loadRelatedProducts()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRelation = async (id: string) => {
    if (!productId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/produtos/${productId}/related/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao remover produto relacionado')
      }

      toast.success('Produto relacionado removido')
      setDeleteId(null)
      loadRelatedProducts()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getRelationTypeLabel = (type: string) => {
    return RELATION_TYPES.find(rt => rt.value === type)?.label || type
  }

  const groupedRelations = useMemo(() => {
    const groups = relatedProducts.reduce((acc, relation) => {
      if (!acc[relation.relation_type]) {
        acc[relation.relation_type] = []
      }
      acc[relation.relation_type].push(relation)
      return acc
    }, {} as Record<string, RelatedProductWithDetails[]>)

    // Ordenar por sort_order dentro de cada grupo
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.sort_order - b.sort_order)
    })

    return groups
  }, [relatedProducts])

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Produtos Relacionados</h3>
          <p className="text-sm text-muted-foreground">
            Configure produtos relacionados, acessórios e substitutos
          </p>
        </div>
      </div>

      {!productId && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="font-medium">Produto não salvo</p>
          <p className="text-sm">Salve o produto primeiro para adicionar produtos relacionados</p>
        </div>
      )}

      {productId && (
        <div className="space-y-6">
          {/* Form para adicionar relação */}
          <Card className="p-4 space-y-4">
            <h4 className="font-medium">Adicionar Produto Relacionado</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Buscar Produto</Label>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={searchOpen}
                      className="w-full justify-between"
                    >
                      {selectedProduct ? (
                        <span className="truncate">
                          {selectedProduct.name} ({selectedProduct.sku})
                        </span>
                      ) : (
                        "Selecione um produto..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar produto..." 
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="max-h-64">
                          {filteredProducts
                            .filter(p => p.id !== productId) // Não mostrar o produto atual
                            .slice(0, 50) // Limitar resultados
                            .map((product) => (
                            <CommandItem
                              key={product.id}
                              value={`${product.name} ${product.sku}`}
                              onSelect={() => {
                                setSelectedProduct(product)
                                setSearchOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {product.sku} • R$ {product.price.toFixed(2)}
                                  {product.category_name && ` • ${product.category_name}`}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Relação</Label>
                <Select value={relationType} onValueChange={(value: any) => setRelationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleAddRelation} 
                  disabled={loading || !selectedProduct}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </Card>

          {/* Lista de produtos relacionados */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h4 className="font-medium mb-4">Produtos Relacionados ({relatedProducts.length})</h4>
                
                {Object.entries(groupedRelations).map(([type, relations]) => (
                  <div key={type} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{getRelationTypeLabel(type)}</Badge>
                      <span className="text-sm text-muted-foreground">({relations.length})</span>
                    </div>
                    
                    <ScrollArea className="max-h-64">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relations.map((relation) => (
                            <TableRow key={relation.id}>
                              <TableCell className="font-medium">
                                {relation.related_product?.name || 'Nome não disponível'}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {relation.related_product?.sku || 'N/A'}
                              </TableCell>
                              <TableCell>
                                R$ {relation.related_product?.price?.toFixed(2) || '0.00'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {relation.related_product?.category?.name || 'Sem categoria'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(relation.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog de confirmação de remoção */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja remover este produto relacionado?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleRemoveRelation(deleteId)}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}