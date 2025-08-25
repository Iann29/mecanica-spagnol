"use client"

import { useEffect, useMemo, useState } from "react"
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
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [slugEdited, setSlugEdited] = useState(false)
  
  // Zustand store para persistência
  const {
    formData: persistedFormData,
    setMode: setStoreMode,
    updateFormData,
    updateField,
    setImages: setStoreImages,
    setCategories: setStoreCategories,
    clearForm,
    getDebugInfo
  } = useProductFormStore()

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

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name")
        .eq("is_active", true)
        .order("name")
      if (error) {
        console.error('--debug (remover) Error loading categories:', error)
        toast.error('Erro ao carregar categorias')
        return
      }
      if (data && data.length > 0) {
        const categoryOptions = data as unknown as CategoryOption[]
        setCategories(categoryOptions)
        setStoreCategories(categoryOptions)
      } else {
        toast.error('Nenhuma categoria encontrada. Crie pelo menos uma categoria primeiro.')
      }
    }
    loadCategories()
  }, [])

  // Se modo edição e sem initialData, buscar dados do produto
  useEffect(() => {
    if (mode === "edit" && productId && !initialData) {
      ;(async () => {
        const res = await fetch(`/api/produtos/${productId}`, { cache: "no-store" })
        if (!res.ok) return
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
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, productId])

  // Upload
  const uploadBasePath = useMemo(() => {
    const slug = form.getValues("slug") || slugify(form.getValues("name")) || "produto"
    const ts = Date.now()
    return `${slug}-${ts}`
  }, [form])

  const upload = useSupabaseUpload({
    bucketName: "products",
    path: uploadBasePath,
    allowedMimeTypes: ["image/*"],
    maxFiles: 6,
    maxFileSize: 6 * 1024 * 1024,
    upsert: false,
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
        errors: upload.errors.length
      }
    })
  }, [upload.files.length, upload.loading, upload.successes.length, upload.errors.length, uploadBasePath])

  useEffect(() => {
    // quando upload conclui, atualizar imagens com URLs públicas
    const setPublicUrls = async () => {
      if (!upload.isSuccess || upload.successes.length === 0) {
        return
      }
      const urls = upload.successes.map((name) => {
        const path = `${uploadBasePath}/${name}`
        const { data } = supabase.storage.from("products").getPublicUrl(path)
        return data.publicUrl
      })
      const newImages = Array.from(new Set([...images, ...urls]))
      setImages(newImages)
      setStoreImages(newImages)
      form.setValue("images", newImages)
    }
    setPublicUrls()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload.isSuccess, upload.successes.length])

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
    const payload = { ...values, category_id: Number(values.category_id), images }
    const isEdit = mode === "edit" && productId

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

      toast.success(isEdit ? "Produto atualizado" : "Produto criado")
      
      // Limpar dados persistidos após sucesso
      if (mode === 'create') {
        clearForm()
      }
      
      router.push("/admin/produtos")
      router.refresh()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Erro ao salvar produto"
      toast.error(errorMessage)
    }
  }

  const removeImage = (url: string) => {
    const next = images.filter((u) => u !== url)
    setImages(next)
    setStoreImages(next)
    form.setValue("images", next)
  }

  return (
    <div className={cn("max-w-5xl mx-auto space-y-6 p-4 md:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Novo Produto" : "Editar Produto"}
          </h1>
          <p className="text-sm text-muted-foreground">Preencha as informações do produto</p>
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
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
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
                        className="absolute top-1 right-1 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded opacity-90 hover:opacity-100"
                      >
                        Remover
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
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
