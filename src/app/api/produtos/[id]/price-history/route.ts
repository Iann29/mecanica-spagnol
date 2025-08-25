import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';

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

// GET /api/produtos/[id]/price-history -> busca histórico de preços do produto
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const productId = params.id;

  try {
    // Verificar se o produto existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Buscar histórico de preços com informações do usuário que fez a alteração
    const { data: history, error: historyError } = await supabase
      .from('price_history')
      .select(`
        *,
        profile:changed_by (
          full_name,
          email
        )
      `)
      .eq('product_id', productId)
      .order('changed_at', { ascending: false })
      .limit(50); // Limitar a 50 registros mais recentes

    if (historyError) {
      console.error('Error fetching price history:', historyError);
      return NextResponse.json({ error: 'Erro ao buscar histórico de preços' }, { status: 500 });
    }

    return NextResponse.json({
      data: history || [],
      count: history?.length || 0
    });

  } catch (error: unknown) {
    console.error('Price history API error:', error);
    const message = error instanceof Error ? error.message : 'Erro interno do servidor';
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}