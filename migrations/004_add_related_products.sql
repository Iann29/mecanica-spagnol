-- Migração: Criar sistema de produtos relacionados
-- Execute este script no seu banco de dados Supabase

-- Criar tabela related_products
CREATE TABLE related_products (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL,
  related_product_id UUID NOT NULL,
  relation_type VARCHAR(50) DEFAULT 'related', -- 'related', 'accessory', 'substitute', 'upgrade'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT related_products_pkey PRIMARY KEY (id),
  CONSTRAINT related_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT related_products_related_product_id_fkey FOREIGN KEY (related_product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT related_products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id),
  
  -- Não permitir que um produto seja relacionado consigo mesmo
  CONSTRAINT related_products_no_self_relation CHECK (product_id != related_product_id),
  
  -- Não permitir relações duplicadas
  CONSTRAINT related_products_unique_relation UNIQUE (product_id, related_product_id)
) TABLESPACE pg_default;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_related_products_product_id 
ON related_products (product_id);

CREATE INDEX IF NOT EXISTS idx_related_products_related_product_id 
ON related_products (related_product_id);

CREATE INDEX IF NOT EXISTS idx_related_products_type 
ON related_products (relation_type);

CREATE INDEX IF NOT EXISTS idx_related_products_sort 
ON related_products (product_id, sort_order);

-- View para facilitar consultas de produtos relacionados com informações completas
CREATE OR REPLACE VIEW related_products_view AS
SELECT 
  rp.id,
  rp.product_id,
  rp.related_product_id,
  rp.relation_type,
  rp.sort_order,
  rp.created_at,
  rp.created_by,
  
  -- Dados do produto principal
  p.name as product_name,
  p.sku as product_sku,
  p.slug as product_slug,
  
  -- Dados do produto relacionado
  rp_info.name as related_product_name,
  rp_info.sku as related_product_sku,
  rp_info.slug as related_product_slug,
  rp_info.price as related_product_price,
  rp_info.sale_price as related_product_sale_price,
  rp_info.images as related_product_images,
  rp_info.is_active as related_product_is_active,
  
  -- Categoria do produto relacionado
  cat.name as related_product_category_name
  
FROM related_products rp
JOIN products p ON rp.product_id = p.id
JOIN products rp_info ON rp.related_product_id = rp_info.id
LEFT JOIN categories cat ON rp_info.category_id = cat.id;

-- Função para adicionar relação bidirecional automaticamente
CREATE OR REPLACE FUNCTION auto_add_bidirectional_relation()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas adicionar relação reversa se ainda não existe
  IF NOT EXISTS (
    SELECT 1 FROM related_products 
    WHERE product_id = NEW.related_product_id 
    AND related_product_id = NEW.product_id
  ) THEN
    INSERT INTO related_products (
      product_id, 
      related_product_id, 
      relation_type, 
      created_by
    ) VALUES (
      NEW.related_product_id, 
      NEW.product_id, 
      NEW.relation_type,
      NEW.created_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar relação bidirecional (opcional - comentado por padrão)
-- Descomente se quiser que as relações sejam sempre bidirecionais
-- CREATE TRIGGER auto_bidirectional_relation_trigger
--   AFTER INSERT ON related_products
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_add_bidirectional_relation();

-- Função para remover relações bidirecionais
CREATE OR REPLACE FUNCTION auto_remove_bidirectional_relation()
RETURNS TRIGGER AS $$
BEGIN
  -- Remover relação reversa se existir
  DELETE FROM related_products 
  WHERE product_id = OLD.related_product_id 
  AND related_product_id = OLD.product_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para remover relação bidirecional (opcional - comentado por padrão)
-- Descomente se quiser que as remoções sejam sempre bidirecionais
-- CREATE TRIGGER auto_remove_bidirectional_relation_trigger
--   AFTER DELETE ON related_products
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_remove_bidirectional_relation();

-- Função para buscar produtos relacionados com limite
CREATE OR REPLACE FUNCTION get_related_products(
  p_product_id UUID,
  p_relation_type VARCHAR(50) DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  sku TEXT,
  price NUMERIC,
  sale_price NUMERIC,
  images JSONB,
  category_name TEXT,
  relation_type VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rpv.related_product_id,
    rpv.related_product_name,
    rpv.related_product_slug,
    rpv.related_product_sku,
    rpv.related_product_price,
    rpv.related_product_sale_price,
    rpv.related_product_images,
    rpv.related_product_category_name,
    rpv.relation_type
  FROM related_products_view rpv
  WHERE rpv.product_id = p_product_id
    AND rpv.related_product_is_active = true
    AND (p_relation_type IS NULL OR rpv.relation_type = p_relation_type)
  ORDER BY rpv.sort_order ASC, rpv.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE related_products IS 'Relacionamentos entre produtos (produtos relacionados, acessórios, substitutos, etc.)';
COMMENT ON COLUMN related_products.product_id IS 'ID do produto principal';
COMMENT ON COLUMN related_products.related_product_id IS 'ID do produto relacionado';
COMMENT ON COLUMN related_products.relation_type IS 'Tipo de relacionamento (related, accessory, substitute, upgrade)';
COMMENT ON COLUMN related_products.sort_order IS 'Ordem de exibição dos produtos relacionados';
COMMENT ON COLUMN related_products.created_by IS 'Usuário que criou a relação';