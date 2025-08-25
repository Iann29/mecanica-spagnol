"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Loader2,
  X
} from "lucide-react"
import type { Product } from "@/types/database"
import type { CSVValidationError } from "@/lib/utils/csv"
import { downloadCSV, CSV_HEADERS } from "@/lib/utils/csv"

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface ImportResults {
  created: number
  updated: number
  errors: Array<{ sku: string; error: string }>
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'results'

export function ImportModal({ open, onOpenChange, onSuccess }: ImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string>("")
  const [preview, setPreview] = useState<Partial<Product>[]>([])
  const [validationErrors, setValidationErrors] = useState<CSVValidationError[]>([])
  const [overwrite, setOverwrite] = useState(false)
  const [importResults, setImportResults] = useState<ImportResults | null>(null)
  const [loading, setLoading] = useState(false)

  const resetModal = () => {
    setStep('upload')
    setCsvFile(null)
    setCsvData("")
    setPreview([])
    setValidationErrors([])
    setOverwrite(false)
    setImportResults(null)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setCsvFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvData(text)
    }
    reader.readAsText(file, 'UTF-8')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  })

  const validateCSV = async () => {
    if (!csvData) return

    setLoading(true)
    try {
      const res = await fetch('/api/produtos/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData, overwrite })
      })

      const result = await res.json()

      if (!res.ok) {
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors)
          setStep('preview')
        } else {
          throw new Error(result.error || 'Erro na validação')
        }
        return
      }

      setPreview(result.preview)
      setValidationErrors([])
      setStep('preview')
      
    } catch (error: any) {
      toast.error(error.message || 'Erro ao validar CSV')
    } finally {
      setLoading(false)
    }
  }

  const executeImport = async () => {
    if (!csvData) return

    setStep('importing')
    setLoading(true)

    try {
      const res = await fetch('/api/produtos/import', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData, overwrite })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Erro na importação')
      }

      setImportResults(result.results)
      setStep('results')
      
      if (result.results.created > 0 || result.results.updated > 0) {
        toast.success(result.message)
        onSuccess?.()
      }

    } catch (error: any) {
      toast.error(error.message || 'Erro ao importar produtos')
      setStep('preview')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const headers = Object.values(CSV_HEADERS).join(',')
    const example = [
      'FILTRO-001',
      'Filtro de Óleo Motor',
      'filtro-oleo-motor',
      'Filtro de óleo para motores a diesel',
      '25.90',
      '19.90',
      '50',
      '1',
      'Filtros',
      '{"compatibilidade": "Mercedes Actros", "aplicacao": "Motor OM457"}',
      'false',
      'true',
      'Filtro de Óleo Motor - Mecânica Spagnol',
      'Filtro de óleo de alta qualidade para motores a diesel. Compatível com Mercedes Actros.',
      'filtro, óleo, motor, diesel, mercedes, actros',
      'https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg'
    ].map(value => {
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')

    const csvContent = [headers, example].join('\n')
    downloadCSV(csvContent, 'modelo-importacao-produtos.csv')
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Produtos
          </DialogTitle>
          <DialogDescription>
            Importe produtos em massa através de arquivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {['upload', 'preview', 'importing', 'results'].map((s, index) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  step === s ? "bg-primary text-primary-foreground" : 
                  ['upload', 'preview', 'importing', 'results'].indexOf(step) > index ? "bg-green-500 text-white" : 
                  "bg-muted text-muted-foreground"
                )}>
                  {['upload', 'preview', 'importing', 'results'].indexOf(step) > index ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  step === s ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {s === 'upload' && 'Upload'}
                  {s === 'preview' && 'Preview'}
                  {s === 'importing' && 'Importando'}
                  {s === 'results' && 'Resultados'}
                </span>
                {index < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <Separator />

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div></div>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
                  <Download className="h-4 w-4" />
                  Baixar Modelo
                </Button>
              </div>

              <Card 
                {...getRootProps()} 
                className={cn(
                  "p-8 cursor-pointer border-2 border-dashed transition-colors",
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? "Solte o arquivo aqui" : "Arraste um arquivo CSV ou clique para selecionar"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Apenas arquivos .csv são aceitos
                    </p>
                  </div>
                </div>
              </Card>

              {csvFile && (
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{csvFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(csvFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="overwrite" 
                          checked={overwrite}
                          onCheckedChange={setOverwrite}
                        />
                        <label htmlFor="overwrite" className="text-sm">
                          Sobrescrever produtos existentes
                        </label>
                      </div>
                      <Button onClick={validateCSV} disabled={loading} className="gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Validando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Validar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div className="space-y-4">
              {validationErrors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">Encontrados {validationErrors.length} erro(s):</p>
                    <ScrollArea className="max-h-32">
                      <div className="space-y-1">
                        {validationErrors.slice(0, 10).map((error, index) => (
                          <div key={index} className="text-sm">
                            Linha {error.row}: <strong>{error.field}</strong> - {error.message}
                          </div>
                        ))}
                        {validationErrors.length > 10 && (
                          <p className="text-sm text-muted-foreground">
                            ... e mais {validationErrors.length - 10} erro(s)
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}

              {preview.length > 0 && validationErrors.length === 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{preview.length} produto(s) prontos para importar</p>
                      <p className="text-sm text-muted-foreground">
                        Revise os dados antes de confirmar a importação
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setStep('upload')}>
                        Voltar
                      </Button>
                      <Button onClick={executeImport} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Importar
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="max-h-96 border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Estoque</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.slice(0, 50).map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>R$ {product.price?.toFixed(2)}</TableCell>
                            <TableCell>{product.stock_quantity}</TableCell>
                            <TableCell>
                              <Badge variant={product.is_active ? "default" : "secondary"}>
                                {product.is_active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {preview.length > 50 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        ... e mais {preview.length - 50} produto(s)
                      </div>
                    )}
                  </ScrollArea>
                </>
              )}
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div>
                <p className="text-lg font-medium">Importando produtos...</p>
                <p className="text-sm text-muted-foreground">
                  Este processo pode levar alguns momentos
                </p>
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && importResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importResults.created}</div>
                  <div className="text-sm text-muted-foreground">Criados</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResults.updated}</div>
                  <div className="text-sm text-muted-foreground">Atualizados</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importResults.errors.length}</div>
                  <div className="text-sm text-muted-foreground">Erros</div>
                </Card>
              </div>

              {importResults.errors.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Erros encontrados:</h4>
                  <ScrollArea className="max-h-32">
                    <div className="space-y-1">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="text-sm">
                          <strong>{error.sku}:</strong> {error.error}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              )}

              <div className="flex justify-end">
                <Button onClick={handleClose}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}