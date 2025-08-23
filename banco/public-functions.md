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

