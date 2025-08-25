"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpecificationItem {
  id: string
  key: string
  value: string
}

interface SpecificationsEditorProps {
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  className?: string
}

export function SpecificationsEditor({ value, onChange, className }: SpecificationsEditorProps) {
  const [specs, setSpecs] = useState<SpecificationItem[]>(() => {
    return Object.entries(value || {}).map(([key, val]) => ({
      id: Math.random().toString(36).substr(2, 9),
      key,
      value: String(val),
    }))
  })

  // --debug (remover) Atualizar specs quando value mudar (para carregar dados na edição)
  useEffect(() => {
    console.log('--debug (remover) SpecificationsEditor useEffect triggered:', { value, valueType: typeof value })
    const newSpecs = Object.entries(value || {}).map(([key, val]) => ({
      id: Math.random().toString(36).substr(2, 9),
      key,
      value: String(val),
    }))
    console.log('--debug (remover) SpecificationsEditor new specs generated:', newSpecs)
    
    // --debug (remover) Só atualizar se realmente mudou para evitar loops
    const currentKeys = specs.map(s => s.key).sort().join('|')
    const newKeys = newSpecs.map(s => s.key).sort().join('|')
    
    if (currentKeys !== newKeys) {
      console.log('--debug (remover) SpecificationsEditor specs changed, updating:', { currentKeys, newKeys })
      setSpecs(newSpecs)
    } else {
      console.log('--debug (remover) SpecificationsEditor specs unchanged, skipping update')
    }
  }, [value, specs])

  const updateParent = (newSpecs: SpecificationItem[]) => {
    console.log('--debug (remover) SpecificationsEditor updateParent called:', newSpecs)
    const result: Record<string, string> = {}
    newSpecs.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        result[spec.key.trim()] = spec.value.trim()
      }
    })
    console.log('--debug (remover) SpecificationsEditor result to parent:', result)
    onChange(result)
  }

  const addSpec = () => {
    console.log('--debug (remover) SpecificationsEditor addSpec called')
    const newSpecs = [
      ...specs,
      {
        id: Math.random().toString(36).substr(2, 9),
        key: "",
        value: "",
      },
    ]
    console.log('--debug (remover) SpecificationsEditor addSpec newSpecs:', newSpecs)
    setSpecs(newSpecs)
    // --debug (remover) NÃO chamar updateParent para specs vazias para evitar loop
    // updateParent(newSpecs) - removido temporariamente
  }

  const removeSpec = (id: string) => {
    const newSpecs = specs.filter(spec => spec.id !== id)
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  const updateSpec = (id: string, field: 'key' | 'value', newValue: string) => {
    console.log('--debug (remover) SpecificationsEditor updateSpec called:', { id, field, newValue })
    const newSpecs = specs.map(spec =>
      spec.id === id ? { ...spec, [field]: newValue } : spec
    )
    console.log('--debug (remover) SpecificationsEditor updateSpec newSpecs:', newSpecs)
    setSpecs(newSpecs)
    updateParent(newSpecs)
  }

  const duplicateKeys = specs
    .filter(spec => spec.key.trim())
    .map(spec => spec.key.trim().toLowerCase())
    .filter((key, index, arr) => arr.indexOf(key) !== index)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">Especificações</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione características técnicas do produto
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpec}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {specs.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">Nenhuma especificação adicionada</p>
            <Button type="button" variant="outline" onClick={addSpec} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar primeira especificação
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <Card key={spec.id} className="p-4">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nome</Label>
                    <Input
                      placeholder="ex: Compatibilidade"
                      value={spec.key}
                      onChange={(e) => updateSpec(spec.id, 'key', e.target.value)}
                      className={cn(
                        duplicateKeys.includes(spec.key.trim().toLowerCase()) && spec.key.trim() 
                          ? "border-destructive focus-visible:ring-destructive" 
                          : ""
                      )}
                    />
                    {duplicateKeys.includes(spec.key.trim().toLowerCase()) && spec.key.trim() && (
                      <p className="text-xs text-destructive">Nome duplicado</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Valor</Label>
                    <Input
                      placeholder="ex: Mercedes-Benz Actros"
                      value={spec.value}
                      onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpec(spec.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {specs.length > 0 && (
        <>
          <Separator />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{specs.filter(s => s.key.trim() && s.value.trim()).length} especificações válidas</span>
            {duplicateKeys.length > 0 && (
              <span className="text-destructive">
                {duplicateKeys.length} nome{duplicateKeys.length > 1 ? 's' : ''} duplicado{duplicateKeys.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}