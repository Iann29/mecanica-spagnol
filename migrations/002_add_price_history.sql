-- Migração: Criar tabela de histórico de preços
-- Execute este script no seu banco de dados Supabase

-- Criar tabela price_history
CREATE TABLE price_history (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL,
  old_price DECIMAL(10,2),
  new_price DECIMAL(10,2),
  old_sale_price DECIMAL(10,2),
  new_sale_price DECIMAL(10,2),
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT price_history_pkey PRIMARY KEY (id),
  CONSTRAINT price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT price_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_price_history_product_id 
ON price_history (product_id);

CREATE INDEX IF NOT EXISTS idx_price_history_changed_at 
ON price_history (changed_at DESC);

-- Função para registrar mudanças de preço automaticamente
CREATE OR REPLACE FUNCTION track_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Só registra se os preços realmente mudaram
  IF (OLD.price != NEW.price) OR 
     (OLD.sale_price IS DISTINCT FROM NEW.sale_price) THEN
    
    INSERT INTO price_history (
      product_id,
      old_price,
      new_price,
      old_sale_price,
      new_sale_price,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.price,
      NEW.price,
      OLD.sale_price,
      NEW.sale_price,
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para produtos
CREATE TRIGGER track_product_price_changes
  AFTER UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION track_price_changes();

-- Comentários para documentação
COMMENT ON TABLE price_history IS 'Histórico de mudanças de preços dos produtos';
COMMENT ON COLUMN price_history.product_id IS 'ID do produto que teve o preço alterado';
COMMENT ON COLUMN price_history.old_price IS 'Preço anterior';
COMMENT ON COLUMN price_history.new_price IS 'Novo preço';
COMMENT ON COLUMN price_history.old_sale_price IS 'Preço promocional anterior';
COMMENT ON COLUMN price_history.new_sale_price IS 'Novo preço promocional';
COMMENT ON COLUMN price_history.changed_by IS 'Usuário que fez a alteração';
COMMENT ON COLUMN price_history.changed_at IS 'Data e hora da alteração';