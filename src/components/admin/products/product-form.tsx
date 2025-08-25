"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types/database"
import { productSchema } from "@/types/forms"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { SpecificationsEditor } from "./specifications-editor"
import { SEOFields } from "./seo-fields"
import { PriceHistoryTimeline } from "./price-history-timeline"
import { VariantManager } from "./variant-manager"
import { RelatedProductsSelector } from "./related-products-selector"
import { useProductFormStore } from "@/store/product-form"
import { cn } from "@/lib/utils"
import Link from "next/link"

const supabase = createClient()

const schema = productSchema

export type ProductFormValues = z.infer<typeof schema>

type CategoryOption = { id: number; name: string }

type ProductFormProps = {
  mode: "create" | "edit"
  productId?: string
  initialData?: Partial<Product>
  className?: string
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function ProductForm({ mode, productId, initialData, className }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [slugEdited, setSlugEdited] = useState(false)
  const [deletingImage, setDeletingImage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialImagesCount] = useState(initialData?.images?.length ?? 0)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  
  // Zustand store para persistência
  const {
    formData: persistedFormData,
    categories: storedCategories,
    setMode: setStoreMode,
    updateFormData,
    updateField,
    setImages: setStoreImages,
    setCategories: setStoreCategories,
    clearForm,
    getDebugInfo
  } = useProductFormStore()
  
  // Estado das categorias: usar do store primeiro, depois estado local
  const [localCategories, setLocalCategories] = useState<CategoryOption[]>(storedCategories || [])

  // Determinar valores iniciais: priorizar initialData (para edição), depois dados persistidos
  const initialValues = useMemo(() => {
    if (initialData) {
      // Modo edição: usar dados do produto
      return {
        sku: initialData.sku ?? "",
        name: initialData.name ?? "",
        slug: initialData.slug ?? "",
        description: initialData.description ?? "",
        price: initialData.price ?? 0,
        sale_price: initialData.sale_price ?? undefined,
        stock_quantity: initialData.stock_quantity ?? 0,
        category_id: initialData.category_id ?? 1,
        images: initialData.images ?? [],
        specifications: (initialData.specifications as Record<string, unknown>) ?? {},
        is_featured: initialData.is_featured ?? false,
        is_active: initialData.is_active ?? true,
        reference: initialData.reference ?? "",
        meta_title: initialData.meta_title ?? "",
        meta_description: initialData.meta_description ?? "",
        meta_keywords: initialData.meta_keywords ?? "",
      }
    } else if (mode === 'create' && persistedFormData && Object.keys(persistedFormData).length > 1) {
      // Modo criação com dados persistidos
      return {
        sku: persistedFormData.sku ?? "",
        name: persistedFormData.name ?? "",
        slug: persistedFormData.slug ?? "",
        description: persistedFormData.description ?? "",
        price: persistedFormData.price ?? 0,
        sale_price: persistedFormData.sale_price ?? undefined,
        stock_quantity: persistedFormData.stock_quantity ?? 0,
        category_id: persistedFormData.category_id ?? 1,
        images: persistedFormData.images ?? [],
        specifications: persistedFormData.specifications ?? {},
        is_featured: persistedFormData.is_featured ?? false,
        is_active: persistedFormData.is_active ?? true,
        reference: persistedFormData.reference ?? "",
        meta_title: persistedFormData.meta_title ?? "",
        meta_description: persistedFormData.meta_description ?? "",
        meta_keywords: persistedFormData.meta_keywords ?? "",
      }
    } else {
      // Valores padrão para novo produto
      return {
        sku: "",
        name: "",
        slug: "",
        description: "",
        price: 0,
        sale_price: undefined,
        stock_quantity: 0,
        category_id: 1,
        images: [],
        specifications: {},
        is_featured: false,
        is_active: true,
        reference: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
      }
    }
  }, [initialData, mode, persistedFormData])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as Resolver<ProductFormValues>,
    defaultValues: initialValues,
    mode: "onChange",
  })

  // Inicializar store com modo e productId (só executa uma vez)
  useEffect(() => {
    setStoreMode(mode, productId)
    
    // Se é criação e não temos initialData, restaurar dados persistidos se existirem
    if (mode === 'create' && !initialData && persistedFormData && Object.keys(persistedFormData).length > 1) {
      form.reset(initialValues)
      setImages(persistedFormData.images ?? [])
    }
  }, [mode, productId]) // Dependências mínimas para evitar re-runs

  // Auto-salvar dados do formulário com debounce para evitar spam
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const subscription = form.watch((value) => {
      if (mode === 'create') {
        // Debounce: só salva após 1 segundo de inatividade
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          updateFormData(value as Partial<ProductFormValues>)
        }, 1000)
      }
    })
    
    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [form.watch, mode, updateFormData])

  // Carregar categorias com fallback do store
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        
        // Se já temos categorias no store, usar enquanto carrega
        if (storedCategories && storedCategories.length > 0) {
          setLocalCategories(storedCategories)
          setCategoriesLoading(false)
        }
        
        const { data, error } = await supabase
          .from("categories")
          .select("id,name")
          .eq("is_active", true)
          .order("name")
          
        if (error) {
          console.error('Erro ao carregar categorias:', error)
          toast.error('Erro ao carregar categorias')
          
          // Se temos categorias no store, manter elas
          if (storedCategories && storedCategories.length > 0) {
            setLocalCategories(storedCategories)
          }
          return
        }
        
        if (data && data.length > 0) {
          const categoryOptions = data as unknown as CategoryOption[]
          setLocalCategories(categoryOptions)
          setStoreCategories(categoryOptions)
        } else {
          toast.error('Nenhuma categoria encontrada. Crie pelo menos uma categoria primeiro.')
        }
      } catch (error) {
        console.error('Erro inesperado ao carregar categorias:', error)
        toast.error('Erro inesperado ao carregar categorias')
        
        // Fallback para categorias do store
        if (storedCategories && storedCategories.length > 0) {
          setLocalCategories(storedCategories)
        }
      } finally {
        setCategoriesLoading(false)
      }
    }
    
    loadCategories()
  }, []) // Não incluir storedCategories nas dependências para evitar loops

  // Se modo edição e sem initialData, buscar dados do produto
  useEffect(() => {
    if (mode === "edit" && productId && !initialData) {
      ;(async () => {
        try {
          const res = await fetch(`/api/produtos/${productId}`, { cache: "no-store" })
          if (!res.ok) {
            console.error('Erro ao buscar produto:', res.status, res.statusText)
            toast.error('Erro ao carregar dados do produto')
            return
          }
          const json = await res.json()
          const prod: Product = json.data
          const resetData = {
            sku: prod.sku,
            name: prod.name,
            slug: prod.slug,
            description: prod.description ?? "",
            price: prod.price,
            sale_price: prod.sale_price ?? undefined,
            stock_quantity: prod.stock_quantity,
            category_id: prod.category_id ?? 1,
            images: prod.images ?? [],
            specifications: (prod.specifications as Record<string, unknown>) ?? {},
            is_featured: prod.is_featured,
            is_active: prod.is_active,
            reference: prod.reference ?? "",
            meta_title: prod.meta_title ?? "",
            meta_description: prod.meta_description ?? "",
            meta_keywords: prod.meta_keywords ?? "",
          }
          form.reset(resetData)
          setImages(prod.images ?? [])
        } catch (error) {
          console.error('Erro ao buscar dados do produto:', error)
          toast.error('Erro ao carregar produto. Verifique sua conexão.')
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, productId])

  // Upload path fixo para consistência
  const uploadBasePath = useMemo(() => {
    // Em modo edição, sempre usar o ID do produto (pasta final)
    if (mode === "edit" && productId) {
      return productId
    }
    // Em modo criação, usar pasta temporária até salvar (será movido no server)
    const slug = slugify(initialValues.name || "produto")
    const ts = Date.now()
    return `drafts/${slug}-${ts}`
  }, [mode, productId, initialValues.name])

  const upload = useSupabaseUpload({
    bucketName: "products",
    path: uploadBasePath,
    allowedMimeTypes: ["image/*"],
    maxFiles: 6,
    maxFileSize: 6 * 1024 * 1024,
    upsert: mode === "edit", // Permitir sobrescrever arquivos ao editar
  })
  
  // Log apenas quando o estado do upload mudar (não em cada render)
  useEffect(() => {
    console.log('📋 [PRODUCT-FORM] Upload state changed:', {
      bucketName: "products",
      path: uploadBasePath,
      uploadState: {
        files: upload.files.length,
        loading: upload.loading,
        successes: upload.successes.length,
        errors: upload.errors.length,
        uploadedPaths: upload.uploadedPaths?.length ?? 0
      }
    })
  }, [upload.files.length, upload.loading, upload.successes.length, upload.errors.length, upload.uploadedPaths?.length, uploadBasePath])

  // Processar novos uploads: converter paths em URLs públicas e anexar
  const lastProcessedCountRef = useRef(0)
  useEffect(() => {
    const processNewUploads = () => {
      const total = upload.uploadedPaths?.length ?? 0
      if (upload.loading) return
      if (total <= lastProcessedCountRef.current) return
      const newPaths = upload.uploadedPaths!.slice(lastProcessedCountRef.current)
      const urls = newPaths.map((p) => supabase.storage.from("products").getPublicUrl(p).data.publicUrl)
      const newImages = Array.from(new Set([...images, ...urls]))
      setImages(newImages)
      setStoreImages(newImages)
      form.setValue("images", newImages)
      setHasUnsavedChanges(true)

      lastProcessedCountRef.current = total
      toast.success(`${newPaths.length} imagem(ns) adicionada(s). Lembre-se de salvar as alterações.`)
    }
    processNewUploads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload.uploadedPaths?.length, upload.loading])

  // Auto slug quando nome muda (se usuário não editou slug manualmente)
  useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "name" && !slugEdited) {
        const auto = slugify(value.name ?? "")
        form.setValue("slug", auto)
      }
    })
    return () => sub.unsubscribe()
  }, [form, slugEdited])

  const onSubmit = async (values: ProductFormValues) => {
    const isEdit = mode === "edit" && productId
    // Em criação, enviar também os storage paths para o backend mover para a pasta final
    const uploadedPaths = (upload.uploadedPaths || []).slice(0)
    const payload = {
      ...values,
      category_id: Number(values.category_id),
      images,
      ...(isEdit ? {} : { uploaded_paths: uploadedPaths })
    } as Record<string, unknown>

    try {
      const res = await fetch(isEdit ? `/api/produtos/${productId}` : "/api/produtos", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? "Erro ao salvar produto")
      }

      const json = await res.json().catch(() => ({}))
      const createdOrUpdated: Product | undefined = json?.data

      toast.success(isEdit ? "Produto atualizado" : "Produto criado")
      
      // Limpar estados após sucesso
      setHasUnsavedChanges(false)
      if (mode === 'create') {
        clearForm()
      }

      // Se criou produto, levar para a página de edição e sincronizar imagens retornadas
      if (!isEdit && createdOrUpdated) {
        if (createdOrUpdated.images && Array.isArray(createdOrUpdated.images)) {
          setImages(createdOrUpdated.images)
          setStoreImages(createdOrUpdated.images)
          form.setValue("images", createdOrUpdated.images)
        }
        router.push(`/admin/produtos/${createdOrUpdated.id}`)
        router.refresh()
        return
      }

      // Caso edição, voltar para lista
      router.push("/admin/produtos")
      router.refresh()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Erro ao salvar produto"
      toast.error(errorMessage)
    }
  }

  const removeImage = async (url: string) => {
    // Confirmar antes de excluir
    if (!confirm("Tem certeza que deseja remover esta imagem?")) {
      return
    }

    setDeletingImage(url) // Mostrar indicador de carregamento

    try {
      // Extrair o path do arquivo da URL pública
      // URL formato: https://[project].supabase.co/storage/v1/object/public/products/[path]/[filename]
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/storage/v1/object/public/products/')
      
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        
        // Deletar do Supabase Storage
        const { error } = await supabase.storage
          .from('products')
          .remove([filePath])
        
        if (error) {
          console.error('Erro ao deletar imagem do storage:', error)
          toast.error('Erro ao remover imagem do servidor')
          setDeletingImage(null)
          return
        }
      } else {
        toast.error('Não foi possível identificar o caminho da imagem')
        setDeletingImage(null)
        return
      }
      
      // Remover da lista local
      const next = images.filter((u) => u !== url)
      setImages(next)
      setStoreImages(next)
      form.setValue("images", next)
      setHasUnsavedChanges(true)
      
      toast.success('Imagem removida do servidor. Lembre-se de salvar as alterações.')
    } catch (error) {
      console.error('Erro ao processar remoção da imagem:', error)
      toast.error('Erro ao remover imagem')
    } finally {
      setDeletingImage(null) // Remover indicador de carregamento
    }
  }

  return (
    <div className={cn("max-w-5xl mx-auto space-y-6 p-4 md:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Novo Produto" : "Editar Produto"}
            {hasUnsavedChanges && (
              <span className="text-orange-500 text-base ml-2">*</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">Preencha as informações do produto</p>
          {hasUnsavedChanges && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Você tem alterações não salvas
            </p>
          )}
          {mode === 'create' && persistedFormData && Object.keys(persistedFormData).length > 1 && (
            <p className="text-xs text-blue-600 mt-1">
              📝 Rascunho salvo automaticamente - seus dados estão protegidos
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {mode === 'create' && persistedFormData && Object.keys(persistedFormData).length > 1 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                clearForm()
                form.reset(initialValues)
                setImages([])
                toast.success("Rascunho limpo com sucesso")
              }}
              className="text-destructive hover:text-destructive"
            >
              🗑️ Limpar Rascunho
            </Button>
          )}
          <Link href="/admin/produtos">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-1 gap-6">
        <Form {...form}>
          <form className="xl:col-span-7 lg:col-span-1 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Filtro de Óleo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referência</FormLabel>
                    <FormControl>
                      <Input placeholder="70530043 RE" {...field} />
                    </FormControl>
                    <FormDescription>Código de referência comercial</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="filtro-de-oleo"
                        {...field}
                        onChange={(e) => {
                          setSlugEdited(true)
                          field.onChange(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>URL amigável do produto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(Number(val))
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Carregando categorias...
                          </div>
                        ) : localCategories.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Nenhuma categoria disponível
                          </div>
                        ) : (
                          localCategories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Detalhes do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === "" ? 0 : parseFloat(v))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Promocional (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === "" ? undefined : parseFloat(v))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === "" ? 0 : parseInt(v, 10))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Imagens</FormLabel>
              <Dropzone className="min-h-40" {...upload}>
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {images.map((url) => (
                    <div key={url} className="relative group rounded border overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Imagem" className="w-full h-28 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        disabled={deletingImage === url}
                        className="absolute top-1 right-1 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingImage === url ? "Removendo..." : "Remover"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SpecificationsEditor
                      value={field.value as Record<string, unknown>}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </Card>

            {/* Variações do Produto */}
            <VariantManager 
              productId={mode === "edit" ? productId : undefined}
              baseSKU={form.watch("sku")}
              basePrice={form.watch("price")}
            />

            {/* Produtos Relacionados */}
            <RelatedProductsSelector 
              productId={mode === "edit" ? productId : undefined}
              currentProductName={form.watch("name")}
            />

            {/* Botões de Ação */}
            <div className="flex justify-end gap-2 pt-6 border-t">
              <Link href="/admin/produtos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                variant={hasUnsavedChanges ? "default" : "outline"}
                className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                {form.formState.isSubmitting ? "Salvando..." : hasUnsavedChanges ? "Salvar Alterações" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Sidebar com configurações e SEO */}
        <div className="xl:col-span-5 lg:col-span-1 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Configurações</h3>
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Produto em destaque</FormLabel>
                        <FormDescription>
                          Aparecerá na página inicial
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Produto ativo</FormLabel>
                        <FormDescription>
                          Visível na loja online
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </Card>

          <SEOFields form={form} productName={form.watch("name")} />
          
          {/* Histórico de Preços - apenas no modo edição */}
          {mode === "edit" && productId && (
            <PriceHistoryTimeline productId={productId} />
          )}
        </div>
      </div>
    </div>
  )
}
