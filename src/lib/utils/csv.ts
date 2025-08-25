import type { Product } from '@/types/database'

// Interface para dados de produto no CSV
export interface ProductCSVData {
  sku: string
  name: string
  slug: string
  description: string
  price: number
  sale_price: number | null
  stock_quantity: number
  category_id: number
  category_name: string
  specifications: string // JSON stringified
  is_featured: boolean
  is_active: boolean
  meta_title: string
  meta_description: string
  meta_keywords: string
  images: string // URLs separadas por vírgula
}

// Mapear cabeçalhos CSV para nomes amigáveis em português
export const CSV_HEADERS = {
  sku: 'SKU',
  name: 'Nome',
  slug: 'Slug',
  description: 'Descrição',
  price: 'Preço',
  sale_price: 'Preço Promocional',
  stock_quantity: 'Estoque',
  category_id: 'ID Categoria',
  category_name: 'Nome da Categoria',
  specifications: 'Especificações (JSON)',
  is_featured: 'Destaque',
  is_active: 'Ativo',
  meta_title: 'Título SEO',
  meta_description: 'Descrição SEO',
  meta_keywords: 'Palavras-chave SEO',
  images: 'Imagens (URLs separadas por vírgula)'
} as const

// Converter produto para linha CSV
export function productToCSV(product: Product & { category?: { name: string } }): ProductCSVData {
  return {
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    sale_price: product.sale_price || null,
    stock_quantity: product.stock_quantity,
    category_id: product.category_id,
    category_name: product.category?.name || '',
    specifications: JSON.stringify(product.specifications || {}),
    is_featured: product.is_featured,
    is_active: product.is_active,
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    meta_keywords: product.meta_keywords || '',
    images: product.images?.join(', ') || ''
  }
}

// Converter array de produtos para CSV string
export function productsToCSVString(products: (Product & { category?: { name: string } })[]): string {
  const headers = Object.values(CSV_HEADERS).join(',')
  const rows = products.map(product => {
    const csvData = productToCSV(product)
    return Object.values(csvData).map(value => {
      // Escapar valores que contêm vírgulas ou aspas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value?.toString() || ''
    }).join(',')
  })

  return [headers, ...rows].join('\n')
}

// Converter linha CSV para objeto produto
export function csvToProduct(csvRow: Record<string, string>): Partial<Product> {
  const parseBoolean = (value: string): boolean => {
    return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'sim'
  }

  const parseNumber = (value: string): number => {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }

  const parseSpecifications = (value: string): Record<string, unknown> => {
    if (!value.trim()) return {}
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }

  const parseImages = (value: string): string[] => {
    return value
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url.startsWith('http'))
  }

  return {
    sku: csvRow['SKU'] || csvRow['sku'] || '',
    name: csvRow['Nome'] || csvRow['name'] || '',
    slug: csvRow['Slug'] || csvRow['slug'] || '',
    description: csvRow['Descrição'] || csvRow['description'] || '',
    price: parseNumber(csvRow['Preço'] || csvRow['price'] || '0'),
    sale_price: csvRow['Preço Promocional'] || csvRow['sale_price'] ? parseNumber(csvRow['Preço Promocional'] || csvRow['sale_price']) : undefined,
    stock_quantity: parseNumber(csvRow['Estoque'] || csvRow['stock_quantity'] || '0'),
    category_id: parseNumber(csvRow['ID Categoria'] || csvRow['category_id'] || '1'),
    specifications: parseSpecifications(csvRow['Especificações (JSON)'] || csvRow['specifications'] || '{}'),
    is_featured: parseBoolean(csvRow['Destaque'] || csvRow['is_featured'] || 'false'),
    is_active: parseBoolean(csvRow['Ativo'] || csvRow['is_active'] || 'true'),
    meta_title: csvRow['Título SEO'] || csvRow['meta_title'] || '',
    meta_description: csvRow['Descrição SEO'] || csvRow['meta_description'] || '',
    meta_keywords: csvRow['Palavras-chave SEO'] || csvRow['meta_keywords'] || '',
    images: parseImages(csvRow['Imagens (URLs separadas por vírgula)'] || csvRow['images'] || '')
  }
}

// Parse CSV string para array de objetos
export function parseCSVString(csvString: string): Record<string, string>[] {
  const lines = csvString.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => parseCSVLine(line))

  return rows.map(row => {
    const obj: Record<string, string> = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj
  })
}

// Parse uma linha CSV considerando aspas e escapadas
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Aspas escapadas
        current += '"'
        i += 2
      } else {
        // Início ou fim de aspas
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de campo
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }

  result.push(current.trim())
  return result
}

// Validar dados de produto CSV
export interface CSVValidationError {
  row: number
  field: string
  value: string
  message: string
}

export function validateProductCSV(csvData: Record<string, string>[], existingSKUs: string[] = []): CSVValidationError[] {
  const errors: CSVValidationError[] = []
  const skusInFile = new Set<string>()

  csvData.forEach((row, index) => {
    const rowNumber = index + 2 // +2 porque linha 1 é header e arrays são 0-indexed

    // Validar SKU
    const sku = row['SKU'] || row['sku'] || ''
    if (!sku.trim()) {
      errors.push({
        row: rowNumber,
        field: 'SKU',
        value: sku,
        message: 'SKU é obrigatório'
      })
    } else if (existingSKUs.includes(sku) || skusInFile.has(sku)) {
      errors.push({
        row: rowNumber,
        field: 'SKU',
        value: sku,
        message: 'SKU já existe'
      })
    } else {
      skusInFile.add(sku)
    }

    // Validar nome
    const name = row['Nome'] || row['name'] || ''
    if (!name.trim()) {
      errors.push({
        row: rowNumber,
        field: 'Nome',
        value: name,
        message: 'Nome é obrigatório'
      })
    }

    // Validar slug
    const slug = row['Slug'] || row['slug'] || ''
    if (!slug.trim()) {
      errors.push({
        row: rowNumber,
        field: 'Slug',
        value: slug,
        message: 'Slug é obrigatório'
      })
    }

    // Validar preço
    const price = row['Preço'] || row['price'] || ''
    if (!price.trim() || parseFloat(price) <= 0) {
      errors.push({
        row: rowNumber,
        field: 'Preço',
        value: price,
        message: 'Preço deve ser maior que zero'
      })
    }

    // Validar categoria
    const categoryId = row['ID Categoria'] || row['category_id'] || ''
    if (!categoryId.trim() || parseFloat(categoryId) <= 0) {
      errors.push({
        row: rowNumber,
        field: 'ID Categoria',
        value: categoryId,
        message: 'ID da categoria deve ser válido'
      })
    }
  })

  return errors
}

// Criar arquivo CSV para download
export function downloadCSV(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}