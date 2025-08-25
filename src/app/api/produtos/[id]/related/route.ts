import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import type { RelatedProductInsert } from '@/types/database';

const relatedProductSchema = z.object({
  related_product_id: z.string().uuid('ID do produto relacionado deve ser um UUID válido'),
  relation_type: z.enum(['related', 'accessory', 'substitute', 'upgrade']).default('related'),
  sort_order: z.number().int().default(0),
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
  return { supabase, userId: user.id };
}

// GET /api/produtos/[id]/related -> listar produtos relacionados
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

    // Buscar produtos relacionados com informações completas
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('related_products')
      .select(`
        *,
        related_product:products!related_products_related_product_id_fkey(
          id,
          name,
          sku,
          slug,
          price,
          sale_price,
          images,
          is_active,
          category:categories(name)
        )
      `)
      .eq('product_id', productId)
      .eq('related_product.is_active', true)
      .order('sort_order', { ascending: true });

    if (relatedError) {
      console.error('Error fetching related products:', relatedError);
      return NextResponse.json({ error: 'Erro ao buscar produtos relacionados' }, { status: 500 });
    }

    return NextResponse.json({
      data: relatedProducts || [],
      count: relatedProducts?.length || 0
    });

  } catch (error: unknown) {
    console.error('Related products API error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST /api/produtos/[id]/related -> adicionar produto relacionado
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { supabase, userId, error } = await getAuthorizedClient();
  if (error) return error;

  const productId = params.id;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = relatedProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const relationData = parsed.data;

  try {
    // Verificar se o produto principal existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Verificar se o produto relacionado existe e está ativo
    const { data: relatedProduct, error: relatedProductError } = await supabase
      .from('products')
      .select('id, is_active')
      .eq('id', relationData.related_product_id)
      .single();

    if (relatedProductError) {
      return NextResponse.json({ error: 'Produto relacionado não encontrado' }, { status: 400 });
    }

    if (!relatedProduct.is_active) {
      return NextResponse.json({ error: 'Produto relacionado não está ativo' }, { status: 400 });
    }

    // Verificar se o produto não está tentando se relacionar consigo mesmo
    if (productId === relationData.related_product_id) {
      return NextResponse.json({ 
        error: 'Um produto não pode ser relacionado consigo mesmo' 
      }, { status: 400 });
    }

    // Verificar se esta relação já existe
    const { data: existing, error: existingError } = await supabase
      .from('related_products')
      .select('id')
      .eq('product_id', productId)
      .eq('related_product_id', relationData.related_product_id)
      .eq('relation_type', relationData.relation_type)
      .single();

    if (existing) {
      return NextResponse.json({ 
        error: 'Esta relação já existe' 
      }, { status: 400 });
    }

    // Criar relação
    const relationPayload: RelatedProductInsert = {
      product_id: productId,
      created_by: userId,
      ...relationData
    };

    const { data: newRelation, error: insertError } = await supabase
      .from('related_products')
      .insert(relationPayload)
      .select(`
        *,
        related_product:products!related_products_related_product_id_fkey(
          id,
          name,
          sku,
          price,
          category:categories(name)
        )
      `)
      .single();

    if (insertError) {
      console.error('Error creating relation:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ data: newRelation }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create related product error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}