-- Migração: Adicionar campos SEO aos produtos
-- Execute este script no seu banco de dados Supabase

-- Adicionar campos SEO à tabela products
ALTER TABLE products 
ADD COLUMN meta_title VARCHAR(60),
ADD COLUMN meta_description TEXT,
ADD COLUMN meta_keywords TEXT;

-- Comentários para documentação
COMMENT ON COLUMN products.meta_title IS 'Título SEO do produto (máx 60 caracteres)';
COMMENT ON COLUMN products.meta_description IS 'Descrição SEO do produto (máx 160 caracteres recomendados)';
COMMENT ON COLUMN products.meta_keywords IS 'Palavras-chave SEO separadas por vírgula';

-- Opcional: Criar índice para busca por palavras-chave
CREATE INDEX IF NOT EXISTS idx_products_meta_keywords 
ON products USING gin (to_tsvector('portuguese', meta_keywords));

-- Opcional: Criar índice para busca por título SEO
CREATE INDEX IF NOT EXISTS idx_products_meta_title 
ON products USING gin (to_tsvector('portuguese', meta_title));