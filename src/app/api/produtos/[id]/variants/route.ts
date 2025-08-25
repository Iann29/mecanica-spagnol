import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import type { ProductVariantInsert } from '@/types/database';

const variantSchema = z.object({
  name: z.string().min(1, 'Nome da variação é obrigatório'),
  value: z.string().min(1, 'Valor da variação é obrigatório'),
  price_modifier: z.number().default(0),
  stock_quantity: z.number().int().min(0).default(0),
  sku_suffix: z.string().optional(),
  is_active: z.boolean().default(true),
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
  return { supabase };
}

// GET /api/produtos/[id]/variants -> listar variações do produto
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

    // Buscar variações
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (variantsError) {
      console.error('Error fetching variants:', variantsError);
      return NextResponse.json({ error: 'Erro ao buscar variações' }, { status: 500 });
    }

    return NextResponse.json({
      data: variants || [],
      count: variants?.length || 0
    });

  } catch (error: unknown) {
    console.error('Variants API error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST /api/produtos/[id]/variants -> criar nova variação
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const productId = params.id;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = variantSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const variantData = parsed.data;

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

    // Verificar se já existe variação com mesmo nome e valor
    const { data: existing, error: existingError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('name', variantData.name)
      .eq('value', variantData.value)
      .single();

    if (existing) {
      return NextResponse.json({ 
        error: 'Já existe uma variação com este nome e valor' 
      }, { status: 400 });
    }

    // Criar variação
    const variantPayload: ProductVariantInsert = {
      product_id: productId,
      ...variantData
    };

    const { data: newVariant, error: insertError } = await supabase
      .from('product_variants')
      .insert(variantPayload)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating variant:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ data: newVariant }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create variant error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}