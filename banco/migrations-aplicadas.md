# Migrações Aplicadas no Banco de Dados

Este documento registra todas as migrações que foram aplicadas no banco de dados Supabase.

## Histórico de Migrações

### Migração 006 - Campo de Referência Comercial (25/08/2025)

**Objetivo:** Adicionar campo de referência comercial aos produtos para armazenar códigos de referência do fornecedor.

**Alterações realizadas:**
- Adicionado campo `reference` (VARCHAR(100)) na tabela `products`
- Criado índice `idx_products_reference` para otimizar buscas por referência
- Campo permite valores nulos para manter compatibilidade com produtos existentes

**SQL executado:**
```sql
-- Adicionar campo reference na tabela products
ALTER TABLE products 
ADD COLUMN reference VARCHAR(100);

-- Criar índice para busca por referência
CREATE INDEX IF NOT EXISTS idx_products_reference 
ON products (reference);

-- Comentário para documentação
COMMENT ON COLUMN products.reference IS 'Código de referência comercial do fornecedor (ex: 70530043 RE, F.00N.202.354)';
```

**Status:** ✅ Aplicada com sucesso

---

## Estrutura Atual da Tabela Products

Após a aplicação das migrações, a tabela `products` possui os seguintes campos:

- `id` (uuid) - Identificador único
- `sku` (text) - Código SKU do produto
- `name` (text) - Nome do produto  
- `slug` (text) - URL amigável
- `description` (text) - Descrição detalhada
- `price` (numeric) - Preço normal
- `sale_price` (numeric) - Preço promocional
- `stock_quantity` (integer) - Quantidade em estoque
- `category_id` (integer) - ID da categoria
- `images` (jsonb) - Array de URLs das imagens
- `specifications` (jsonb) - Especificações técnicas
- `is_featured` (boolean) - Produto em destaque
- `is_active` (boolean) - Produto ativo
- `reference` (varchar) - **NOVO** - Código de referência comercial
- `meta_title` (varchar) - Título SEO
- `meta_description` (text) - Descrição SEO
- `meta_keywords` (text) - Palavras-chave SEO
- `created_at` (timestamp) - Data de criação
- `updated_at` (timestamp) - Data de atualização

## Índices da Tabela Products

- `products_pkey` - Chave primária (id)
- `products_sku_key` - Único (sku)
- `products_slug_key` - Único (slug)
- `idx_products_category` - Busca por categoria
- `idx_products_sku` - Busca por SKU
- `idx_products_slug` - Busca por slug
- `idx_products_active` - Busca por produtos ativos
- `idx_products_meta_keywords` - Busca textual em keywords
- `idx_products_meta_title` - Busca textual em título
- `idx_products_reference` - **NOVO** - Busca por referência comercial