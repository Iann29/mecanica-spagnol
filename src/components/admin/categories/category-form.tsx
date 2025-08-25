"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Category } from "@/types/database"
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
import { cn } from "@/lib/utils"
import Link from "next/link"

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

type CategoryFormProps = {
  mode: "create" | "edit"
  categoryId?: string
  initialData?: Partial<Category>
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

export function CategoryForm({ mode, categoryId, initialData, className }: CategoryFormProps) {
  const router = useRouter()
  const [slugEdited, setSlugEdited] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      image_url: initialData?.image_url ?? "",
      is_active: initialData?.is_active ?? true,
    },
    mode: "onChange",
  })

  // Se modo edição e sem initialData, buscar dados da categoria
  useEffect(() => {
    if (mode === "edit" && categoryId && !initialData) {
      ;(async () => {
        const res = await fetch(`/api/categorias/${categoryId}`, { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const cat: Category = json.data
        form.reset({
          name: cat.name,
          slug: cat.slug,
          description: cat.description ?? "",
          image_url: cat.image_url ?? "",
          is_active: cat.is_active,
        })
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, categoryId])

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

  const onSubmit = async (values: CategoryFormValues) => {
    const isEdit = mode === "edit" && categoryId

    try {
      const res = await fetch(isEdit ? `/api/categorias/${categoryId}` : "/api/categorias", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? "Erro ao salvar categoria")
      }

      toast.success(isEdit ? "Categoria atualizada" : "Categoria criada")
      router.push("/admin/categorias")
      router.refresh()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Erro ao salvar categoria"
      toast.error(errorMessage)
    }
  }

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6 p-4 md:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Nova Categoria" : "Editar Categoria"}
          </h1>
          <p className="text-sm text-muted-foreground">Preencha as informações da categoria</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/categorias">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
            {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Filtros" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="filtros"
                          {...field}
                          onChange={(e) => {
                            setSlugEdited(true)
                            field.onChange(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>URL amigável da categoria</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Opcional</FormDescription>
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
                      <Textarea rows={4} placeholder="Descrição da categoria" {...field} />
                    </FormControl>
                    <FormDescription>Opcional. Será exibida na página da categoria.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-medium">Status</h3>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Categoria ativa</FormLabel>
                        <FormDescription>
                          Categorias inativas não aparecem na loja
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          </Card>

          {form.watch("image_url") && (
            <Card className="p-6">
              <div className="space-y-2">
                <h3 className="font-medium">Preview da Imagem</h3>
                <div className="aspect-video rounded-md border overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.watch("image_url")}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}