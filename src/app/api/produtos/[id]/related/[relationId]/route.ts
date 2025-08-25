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
  return { supabase, userId: user.id };
}

// DELETE /api/produtos/[id]/related/[relationId] -> remover produto relacionado
export async function DELETE(
  _request: Request, 
  { params }: { params: { id: string; relationId: string } }
) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id: productId, relationId } = params;

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

    // Verificar se a relação existe e pertence ao produto
    const { data: relation, error: relationError } = await supabase
      .from('related_products')
      .select('id')
      .eq('id', relationId)
      .eq('product_id', productId)
      .single();

    if (relationError || !relation) {
      return NextResponse.json({ error: 'Relação não encontrada' }, { status: 404 });
    }

    // Remover a relação
    const { error: deleteError } = await supabase
      .from('related_products')
      .delete()
      .eq('id', relationId);

    if (deleteError) {
      console.error('Error deleting relation:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Delete related product error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}