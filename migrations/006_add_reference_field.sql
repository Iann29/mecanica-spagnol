-- Migração: Adicionar campo de referência comercial aos produtos
-- Execute este script no seu banco de dados Supabase

-- =================================
-- ADICIONAR CAMPO REFERENCE
-- =================================

-- Adicionar campo reference na tabela products
ALTER TABLE products 
ADD COLUMN reference VARCHAR(100);

-- Criar índice para busca por referência
CREATE INDEX IF NOT EXISTS idx_products_reference 
ON products (reference);

-- Comentário para documentação
COMMENT ON COLUMN products.reference IS 'Código de referência comercial do fornecedor (ex: 70530043 RE, F.00N.202.354)';

-- =================================
-- VERIFICAÇÃO DA MIGRAÇÃO
-- =================================

-- Query para verificar se o campo foi criado corretamente
-- Descomente para testar:

/*
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products'
AND column_name = 'reference';

-- Verificar se o índice foi criado
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'products' 
AND indexname = 'idx_products_reference';
*/