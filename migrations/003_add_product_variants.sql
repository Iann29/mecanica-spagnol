-- Migração: Criar sistema de variações de produtos
-- Execute este script no seu banco de dados Supabase

-- Criar tabela product_variants
CREATE TABLE product_variants (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL,
  name VARCHAR(50) NOT NULL, -- ex: "Tamanho", "Cor", "Capacidade"
  value VARCHAR(100) NOT NULL, -- ex: "Grande", "Azul", "500ml"
  price_modifier DECIMAL(10,2) DEFAULT 0, -- modificador de preço (+/-) 
  stock_quantity INTEGER DEFAULT 0,
  sku_suffix VARCHAR(20), -- sufixo para adicionar ao SKU base
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0, -- ordem de exibição
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  
  -- Não permitir variações duplicadas para o mesmo produto
  CONSTRAINT product_variants_unique_variant UNIQUE (product_id, name, value)
) TABLESPACE pg_default;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
ON product_variants (product_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_active 
ON product_variants (is_active);

CREATE INDEX IF NOT EXISTS idx_product_variants_sort 
ON product_variants (product_id, sort_order);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_variant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_variant_updated_at();

-- Função para gerar SKU completo da variação
CREATE OR REPLACE FUNCTION get_variant_sku(variant_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_sku TEXT;
  suffix TEXT;
BEGIN
  SELECT p.sku, v.sku_suffix
  INTO base_sku, suffix
  FROM product_variants v
  JOIN products p ON v.product_id = p.id
  WHERE v.id = variant_id;
  
  IF suffix IS NOT NULL AND suffix != '' THEN
    RETURN base_sku || '-' || suffix;
  ELSE
    RETURN base_sku;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- View para facilitar consultas de variações com informações do produto
CREATE OR REPLACE VIEW product_variants_view AS
SELECT 
  v.*,
  p.sku as base_sku,
  p.name as product_name,
  p.price as base_price,
  (p.price + COALESCE(v.price_modifier, 0)) as final_price,
  get_variant_sku(v.id) as full_sku
FROM product_variants v
JOIN products p ON v.product_id = p.id;

-- Comentários para documentação
COMMENT ON TABLE product_variants IS 'Variações de produtos (tamanhos, cores, etc.)';
COMMENT ON COLUMN product_variants.product_id IS 'ID do produto pai';
COMMENT ON COLUMN product_variants.name IS 'Nome da variação (ex: Tamanho, Cor)';
COMMENT ON COLUMN product_variants.value IS 'Valor da variação (ex: Grande, Azul)';
COMMENT ON COLUMN product_variants.price_modifier IS 'Modificador de preço (+/- valor do preço base)';
COMMENT ON COLUMN product_variants.stock_quantity IS 'Estoque específico desta variação';
COMMENT ON COLUMN product_variants.sku_suffix IS 'Sufixo para adicionar ao SKU base (ex: -GRD, -AZL)';
COMMENT ON COLUMN product_variants.sort_order IS 'Ordem de exibição das variações';