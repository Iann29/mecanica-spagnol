import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import type { ProductVariantUpdate } from '@/types/database';

const variantUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
  price_modifier: z.number().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  sku_suffix: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
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

// GET /api/produtos/[id]/variants/[variantId] -> buscar variação específica
export async function GET(_request: Request, { params }: { params: { id: string; variantId: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id: productId, variantId } = params;

  try {
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', variantId)
      .eq('product_id', productId)
      .single();

    if (variantError) {
      return NextResponse.json({ error: 'Variação não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ data: variant });

  } catch (error: unknown) {
    console.error('Get variant error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// PATCH /api/produtos/[id]/variants/[variantId] -> atualizar variação
export async function PATCH(request: Request, { params }: { params: { id: string; variantId: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id: productId, variantId } = params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = variantUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = parsed.data;

  try {
    // Verificar se a variação existe e pertence ao produto
    const { data: existing, error: existingError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', variantId)
      .eq('product_id', productId)
      .single();

    if (existingError) {
      return NextResponse.json({ error: 'Variação não encontrada' }, { status: 404 });
    }

    // Se está atualizando nome ou valor, verificar duplicatas
    if (updates.name || updates.value) {
      const name = updates.name || existing.name;
      const value = updates.value || existing.value;

      const { data: duplicate, error: duplicateError } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .eq('name', name)
        .eq('value', value)
        .neq('id', variantId)
        .single();

      if (duplicate) {
        return NextResponse.json({ 
          error: 'Já existe uma variação com este nome e valor' 
        }, { status: 400 });
      }
    }

    // Atualizar variação
    const { data: updatedVariant, error: updateError } = await supabase
      .from('product_variants')
      .update(updates as ProductVariantUpdate)
      .eq('id', variantId)
      .eq('product_id', productId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating variant:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ data: updatedVariant });

  } catch (error: unknown) {
    console.error('Update variant error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// DELETE /api/produtos/[id]/variants/[variantId] -> excluir variação
export async function DELETE(_request: Request, { params }: { params: { id: string; variantId: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id: productId, variantId } = params;

  try {
    // Verificar se a variação existe e pertence ao produto
    const { data: existing, error: existingError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('id', variantId)
      .eq('product_id', productId)
      .single();

    if (existingError) {
      return NextResponse.json({ error: 'Variação não encontrada' }, { status: 404 });
    }

    // Excluir variação
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId)
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Error deleting variant:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('Delete variant error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}