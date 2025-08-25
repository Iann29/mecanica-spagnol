"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Clock, RefreshCw, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PriceHistory } from "@/types/database"

interface PriceHistoryTimelineProps {
  productId: string
  className?: string
}

interface PriceHistoryWithProfile extends PriceHistory {
  profile?: {
    full_name?: string
    email: string
  }
}

export function PriceHistoryTimeline({ productId, className }: PriceHistoryTimelineProps) {
  const [history, setHistory] = useState<PriceHistoryWithProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/produtos/${productId}/price-history`, {
        cache: 'no-store'
      })
      
      if (!res.ok) {
        throw new Error('Falha ao carregar histórico de preços')
      }
      
      const data = await res.json()
      setHistory(data.data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [productId])

  const formatPrice = (price?: number) => {
    if (price === null || price === undefined) return "N/A"
    return `R$ ${price.toFixed(2)}`
  }

  const getPriceChange = (oldPrice?: number, newPrice?: number) => {
    if (!oldPrice || !newPrice) return null
    const change = newPrice - oldPrice
    const percentage = ((change / oldPrice) * 100).toFixed(1)
    
    return {
      amount: change,
      percentage: parseFloat(percentage),
      isIncrease: change > 0,
      isDecrease: change < 0
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  if (loading && history.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Histórico de Preços</h3>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Histórico de Preços</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadHistory} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}

      {history.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="font-medium mb-2">Nenhum histórico encontrado</p>
          <p className="text-sm">
            O histórico será registrado automaticamente quando os preços forem alterados.
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4">
            {history.map((entry, index) => {
              const { date, time } = formatDate(entry.changed_at)
              const priceChange = getPriceChange(entry.old_price, entry.new_price)
              const salePriceChange = getPriceChange(entry.old_sale_price, entry.new_sale_price)

              return (
                <div key={entry.id} className="relative">
                  {index < history.length - 1 && (
                    <div className="absolute left-5 top-10 w-px h-full bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {priceChange?.isIncrease ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : priceChange?.isDecrease ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-sm">Alteração de preço</p>
                          <p className="text-xs text-muted-foreground">
                            {date} às {time}
                            {entry.profile?.full_name && (
                              <> por <span className="font-medium">{entry.profile.full_name}</span></>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Preço Normal */}
                        {(entry.old_price !== undefined || entry.new_price !== undefined) && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground min-w-0">Preço:</span>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-muted-foreground">
                                {formatPrice(entry.old_price)}
                              </span>
                              <span>→</span>
                              <span className="font-medium">
                                {formatPrice(entry.new_price)}
                              </span>
                              {priceChange && (
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    priceChange.isIncrease ? "text-red-700 border-red-200 bg-red-50" : "",
                                    priceChange.isDecrease ? "text-green-700 border-green-200 bg-green-50" : ""
                                  )}
                                >
                                  {priceChange.isIncrease ? "+" : ""}
                                  {priceChange.percentage}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Preço Promocional */}
                        {(entry.old_sale_price !== undefined || entry.new_sale_price !== undefined) && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground min-w-0">Oferta:</span>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-muted-foreground">
                                {formatPrice(entry.old_sale_price)}
                              </span>
                              <span>→</span>
                              <span className="font-medium text-orange-600">
                                {formatPrice(entry.new_sale_price)}
                              </span>
                              {salePriceChange && (
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    salePriceChange.isIncrease ? "text-red-700 border-red-200 bg-red-50" : "",
                                    salePriceChange.isDecrease ? "text-green-700 border-green-200 bg-green-50" : ""
                                  )}
                                >
                                  {salePriceChange.isIncrease ? "+" : ""}
                                  {salePriceChange.percentage}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
  )
}