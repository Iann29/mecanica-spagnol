"use client"

import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Globe, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOFieldsProps {
  form: UseFormReturn<any>
  productName?: string
  className?: string
}

export function SEOFields({ form, productName, className }: SEOFieldsProps) {
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [metaKeywords, setMetaKeywords] = useState("")

  // Watch form values
  const watchedTitle = form.watch("meta_title")
  const watchedDescription = form.watch("meta_description") 
  const watchedKeywords = form.watch("meta_keywords")
  const currentName = form.watch("name")

  useEffect(() => {
    setMetaTitle(watchedTitle || "")
    setMetaDescription(watchedDescription || "")
    setMetaKeywords(watchedKeywords || "")
  }, [watchedTitle, watchedDescription, watchedKeywords])

  // Generate suggestions based on product name
  const suggestedTitle = currentName ? `${currentName} - Mecânica Spagnol` : ""
  const suggestedDescription = currentName 
    ? `Compre ${currentName} na Mecânica Spagnol. Peças automotivas de qualidade com entrega rápida e garantia.`
    : ""

  const titleLength = metaTitle.length
  const descriptionLength = metaDescription.length
  const keywordCount = metaKeywords ? metaKeywords.split(',').filter(k => k.trim()).length : 0

  const getTitleStatus = () => {
    if (titleLength === 0) return { color: "text-muted-foreground", text: "Vazio" }
    if (titleLength < 30) return { color: "text-yellow-600", text: "Muito curto" }
    if (titleLength > 60) return { color: "text-red-600", text: "Muito longo" }
    return { color: "text-green-600", text: "Ótimo" }
  }

  const getDescriptionStatus = () => {
    if (descriptionLength === 0) return { color: "text-muted-foreground", text: "Vazio" }
    if (descriptionLength < 120) return { color: "text-yellow-600", text: "Muito curto" }
    if (descriptionLength > 160) return { color: "text-red-600", text: "Muito longo" }
    return { color: "text-green-600", text: "Ótimo" }
  }

  const titleStatus = getTitleStatus()
  const descriptionStatus = getDescriptionStatus()

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">SEO & Meta Tags</h3>
          <p className="text-sm text-muted-foreground">
            Otimize seu produto para mecanismos de busca
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Label htmlFor="meta_title">Título SEO</Label>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className={titleStatus.color}>
                {titleLength}/60
              </Badge>
              <span className={cn("text-xs whitespace-nowrap", titleStatus.color)}>
                {titleStatus.text}
              </span>
            </div>
          </div>
          <Input
            id="meta_title"
            placeholder={suggestedTitle || "Título que aparecerá no Google"}
            value={metaTitle}
            onChange={(e) => {
              setMetaTitle(e.target.value)
              form.setValue("meta_title", e.target.value)
            }}
            className={cn(
              titleLength > 60 ? "border-red-500 focus-visible:ring-red-500" : "",
              titleLength >= 30 && titleLength <= 60 ? "border-green-500 focus-visible:ring-green-500" : ""
            )}
          />
          {suggestedTitle && !metaTitle && (
            <button
              type="button"
              onClick={() => {
                setMetaTitle(suggestedTitle)
                form.setValue("meta_title", suggestedTitle)
              }}
              className="text-xs text-primary hover:underline"
            >
              Usar sugestão: "{suggestedTitle}"
            </button>
          )}
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Label htmlFor="meta_description">Descrição SEO</Label>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className={descriptionStatus.color}>
                {descriptionLength}/160
              </Badge>
              <span className={cn("text-xs whitespace-nowrap", descriptionStatus.color)}>
                {descriptionStatus.text}
              </span>
            </div>
          </div>
          <Textarea
            id="meta_description"
            rows={3}
            placeholder={suggestedDescription || "Descrição que aparecerá no Google"}
            value={metaDescription}
            onChange={(e) => {
              setMetaDescription(e.target.value)
              form.setValue("meta_description", e.target.value)
            }}
            className={cn(
              descriptionLength > 160 ? "border-red-500 focus-visible:ring-red-500" : "",
              descriptionLength >= 120 && descriptionLength <= 160 ? "border-green-500 focus-visible:ring-green-500" : ""
            )}
          />
          {suggestedDescription && !metaDescription && (
            <button
              type="button"
              onClick={() => {
                setMetaDescription(suggestedDescription)
                form.setValue("meta_description", suggestedDescription)
              }}
              className="text-xs text-primary hover:underline"
            >
              Usar sugestão
            </button>
          )}
        </div>

        {/* Meta Keywords */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Label htmlFor="meta_keywords">Palavras-chave</Label>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="whitespace-nowrap">
                {keywordCount} palavra{keywordCount !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <Input
            id="meta_keywords"
            placeholder="filtro, óleo, motor, manutenção (separadas por vírgula)"
            value={metaKeywords}
            onChange={(e) => {
              setMetaKeywords(e.target.value)
              form.setValue("meta_keywords", e.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            Separe as palavras-chave com vírgulas. Recomendado: 5-10 palavras relevantes.
          </p>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <Label className="font-medium">Preview no Google</Label>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
            <div className="text-lg text-blue-600 hover:underline cursor-pointer font-medium break-words">
              {metaTitle || currentName || "Título do produto"}
            </div>
            <div className="text-sm text-green-700 break-all">
              mecanicaspagnol.com.br/loja/{form.watch("slug") || "produto"}
            </div>
            <div className="text-sm text-gray-600 line-clamp-3 break-words">
              {metaDescription || "Descrição do produto aparecerá aqui. Adicione uma descrição SEO para melhorar o posicionamento no Google."}
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-900">Dicas de SEO</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use palavras-chave relevantes no título e descrição</li>
                <li>• Mantenha o título entre 30-60 caracteres</li>
                <li>• Descrição entre 120-160 caracteres é ideal</li>
                <li>• Inclua benefícios e chamadas para ação</li>
                <li>• Seja específico sobre o produto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}