import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';

// Schema de validação para bulk operations
const bulkActionSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete'], {
    required_error: 'Ação é obrigatória',
    invalid_type_error: 'Ação inválida'
  }),
  ids: z.array(z.string().uuid(), {
    required_error: 'IDs são obrigatórios',
    invalid_type_error: 'IDs devem ser strings UUID válidas'
  }).min(1, 'Pelo menos um ID é obrigatório')
});

async function getAuthorizedClient() {
  const user = await getUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Não autenticado' }, { status: 401 }) };
  }
  const isAdmin = await checkIsAdmin(user.id);
  if (!isAdmin) {
    return { error: NextResponse.json({ error: 'Acesso negado' }, { status: 403 }) };
  }

  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabase = hasServiceKey ? await createAdminClient() : await createClient();
  return { supabase };
}

// POST /api/produtos/bulk -> executa operações em lote
export async function POST(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = bulkActionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { action, ids } = parsed.data;

  try {
    let result;
    let count = 0;

    switch (action) {
      case 'activate':
        result = await supabase
          .from('products')
          .update({ is_active: true })
          .in('id', ids)
          .select('id');
        
        if (result.error) throw result.error;
        count = result.data?.length || 0;
        break;

      case 'deactivate':
        result = await supabase
          .from('products')
          .update({ is_active: false })
          .in('id', ids)
          .select('id');
        
        if (result.error) throw result.error;
        count = result.data?.length || 0;
        break;

      case 'delete':
        // Verificar se algum produto está sendo usado em pedidos
        const { data: orderItems, error: checkError } = await supabase
          .from('order_items')
          .select('product_id')
          .in('product_id', ids)
          .limit(1);

        if (checkError) {
          throw new Error('Erro ao verificar produtos em uso');
        }

        if (orderItems && orderItems.length > 0) {
          return NextResponse.json({ 
            error: 'Alguns produtos não podem ser excluídos pois estão sendo usados em pedidos' 
          }, { status: 400 });
        }

        // Verificar se algum produto está no carrinho
        const { data: cartItems, error: cartError } = await supabase
          .from('cart_items')
          .select('product_id')
          .in('product_id', ids)
          .limit(1);

        if (cartError) {
          throw new Error('Erro ao verificar produtos no carrinho');
        }

        if (cartItems && cartItems.length > 0) {
          return NextResponse.json({ 
            error: 'Alguns produtos não podem ser excluídos pois estão no carrinho de usuários' 
          }, { status: 400 });
        }

        // Limpar arquivos do storage para cada produto
        try {
          const limit = 1000
          for (const pid of ids) {
            let offset = 0
            while (true) {
              const { data: objects, error: listErr } = await supabase.storage
                .from('products')
                .list(pid, { limit, offset })
              if (listErr) break
              if (!objects || objects.length === 0) break
              const paths = objects.map((o) => `${pid}/${o.name}`)
              const { error: rmErr } = await supabase.storage
                .from('products')
                .remove(paths)
              if (rmErr) break
              if (objects.length < limit) break
              offset += limit
            }
          }
        } catch {}

        result = await supabase
          .from('products')
          .delete()
          .in('id', ids)
          .select('id');
        
        if (result.error) throw result.error;
        count = result.data?.length || 0;
        break;

      default:
        return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      count,
      action 
    });

  } catch (error: unknown) {
    console.error('Bulk operation error:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ 
      error: message
    }, { status: 500 });
  }
}
