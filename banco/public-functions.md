## Todas as functions do schema public


# create_profile_for_user
# public
# definition:

DECLARE
  user_full_name text;
  user_phone text;
  user_cpf text;  -- ADICIONADO: declaração da variável CPF
BEGIN
  -- Extrair dados do raw_user_meta_data se existirem
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', NULL);
  user_cpf := COALESCE(NEW.raw_user_meta_data->>'cpf', NULL);  -- ADICIONADO: extração do CPF
  
  -- Log para debug (opcional - remover em produção)
  RAISE NOTICE 'Criando profile para user % com dados: full_name=%, phone=%, cpf=%', 
    NEW.id, user_full_name, user_phone, user_cpf;

  -- Inserir profile com todos os dados disponíveis incluindo CPF
  INSERT INTO public.profiles (id, email, full_name, phone, cpf)  -- ADICIONADO: cpf na lista de campos
  VALUES (NEW.id, NEW.email, user_full_name, user_phone, user_cpf);  -- ADICIONADO: user_cpf nos valores
  
  RETURN NEW;
EXCEPTION 
  WHEN unique_violation THEN
    -- Se o profile já existe, tentar atualizar com novos dados
    UPDATE public.profiles 
    SET 
      full_name = COALESCE(user_full_name, full_name),
      phone = COALESCE(user_phone, phone),
      cpf = COALESCE(user_cpf, cpf),  -- ADICIONADO: atualização do CPF
      updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log do erro para debug
    RAISE WARNING 'Erro ao criar/atualizar profile para user %: %', NEW.id, SQLERRM;
    -- Ainda assim retorna NEW para não bloquear a criação do user
    RETURN NEW;
END;

# generate_order_number
# public
# definition:

BEGIN
  NEW.order_number := 'MS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;

# is_admin_user
# public
# definition:


DECLARE
  user_role text;
BEGIN
  -- Verificar se existe sessão ativa
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Buscar role do usuário atual diretamente (sem RLS)
  -- Esta query NÃO dispara policies pois a função é SECURITY DEFINER
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE id = auth.uid();

  -- Retornar true se é admin, false caso contrário
  RETURN COALESCE(user_role = 'admin', FALSE);

EXCEPTION 
  WHEN NO_DATA_FOUND THEN
    -- Usuário não tem profile, não é admin
    RETURN FALSE;
  WHEN OTHERS THEN
    -- Em caso de qualquer erro, assumir que não é admin por segurança
    RAISE WARNING 'Erro ao verificar admin para user %: %', auth.uid(), SQLERRM;
    RETURN FALSE;
END;

# update_updated_at
# public
# definition:

BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;

# track_price_changes
# public
# definition:

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

# update_variant_updated_at
# public
# definition:

BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;

# get_variant_sku
# public
# definition:

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

# auto_add_bidirectional_relation
# public
# definition:

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

# auto_remove_bidirectional_relation
# public
# definition:

BEGIN
  -- Remover relação reversa se existir
  DELETE FROM related_products 
  WHERE product_id = OLD.related_product_id 
  AND related_product_id = OLD.product_id;
  
  RETURN OLD;
END;

# get_related_products
# public
# definition:

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

