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

  const form = useForm<ProductFormValues, any, ProductFormValues>({
    resolver: zodResolver(schema) as Resolver<ProductFormValues>,
    defaultValues: {
      sku: initialData?.sku ?? "",
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      sale_price: initialData?.sale_price ?? undefined,
      stock_quantity: initialData?.stock_quantity ?? 0,
      category_id: (initialData?.category_id as unknown as number) ?? (undefined as unknown as number),
      images: initialData?.images ?? [],
      specifications: (initialData?.specifications as Record<string, unknown>) ?? {},
      is_featured: initialData?.is_featured ?? false,
      is_active: initialData?.is_active ?? true,
    },
    mode: "onChange",
  })

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name")
        .eq("is_active", true)
        .order("name")
      if (!error && data) {
        setCategories(data as unknown as CategoryOption[])
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
        form.reset({
          sku: prod.sku,
          name: prod.name,
          slug: prod.slug,
          description: prod.description ?? "",
          price: prod.price,
          sale_price: prod.sale_price ?? undefined,
          stock_quantity: prod.stock_quantity,
          category_id: prod.category_id,
          images: prod.images ?? [],
          specifications: (prod.specifications as Record<string, unknown>) ?? {},
          is_featured: prod.is_featured,
          is_active: prod.is_active,
        })
        setImages(prod.images ?? [])
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, productId])

  // Upload
  const uploadBasePath = useMemo(() => {
    const slug = form.getValues("slug") || slugify(form.getValues("name")) || "produto"
    const ts = Date.now()
    return `products/${slug}-${ts}`
  }, [form])

  const upload = useSupabaseUpload({
    bucketName: "products",
    path: uploadBasePath,
    allowedMimeTypes: ["image/*"],
    maxFiles: 6,
    maxFileSize: 6 * 1024 * 1024,
    upsert: false,
  })

  useEffect(() => {
    // quando upload conclui, atualizar imagens com URLs públicas
    const setPublicUrls = async () => {
      if (!upload.isSuccess || upload.successes.length === 0) return
      const urls = upload.successes.map((name) => {
        const path = `${uploadBasePath}/${name}`
        const { data } = supabase.storage.from("products").getPublicUrl(path)
        return data.publicUrl
      })
      setImages((prev) => Array.from(new Set([...prev, ...urls])))
      form.setValue("images", Array.from(new Set([...images, ...urls])))
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
      router.push("/admin/produtos")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar produto")
    }
  }

  const removeImage = (url: string) => {
    const next = images.filter((u) => u !== url)
    setImages(next)
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
        </div>
        <div className="flex gap-2">
          <Link href="/admin/produtos">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="p-4 md:col-span-2 space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      onValueChange={(val) => field.onChange(Number(val))}
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
                  <FormLabel>Especificações (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder='{"compatibilidade":"Carro X"}'
                      value={JSON.stringify(field.value ?? {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const val = JSON.parse(e.target.value)
                          field.onChange(val)
                        } catch {
                          // ignore enquanto digita
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Opcional. Estrutura livre em JSON.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Destaque</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Ativo</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Dica: você pode salvar agora e editar depois. Não esqueça de publicar ("Ativo").
            </div>
          </Card>
        </form>
      </Form>
    </div>
  )
}
