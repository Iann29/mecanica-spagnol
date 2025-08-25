import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';

// Schema de atualização (parcial)
const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().optional(),
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

// GET /api/categorias/[id]
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const { data, error: qErr } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (qErr) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/categorias/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = categoryUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = parsed.data;

  // Se está atualizando slug, verificar se já existe
  if (updates.slug) {
    const { data: existingSlug } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', updates.slug)
      .neq('id', id)
      .single();

    if (existingSlug) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
    }
  }

  // Se está atualizando nome, verificar se já existe
  if (updates.name) {
    const { data: existingName } = await supabase
      .from('categories')
      .select('id')
      .eq('name', updates.name)
      .neq('id', id)
      .single();

    if (existingName) {
      return NextResponse.json({ error: 'Nome já existe' }, { status: 400 });
    }
  }

  const { data, error: upErr } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/categorias/[id]
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  // Verificar se há produtos usando esta categoria
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (prodErr) {
    return NextResponse.json({ error: 'Erro ao verificar produtos' }, { status: 500 });
  }

  if (products && products.length > 0) {
    return NextResponse.json({ 
      error: 'Não é possível excluir categoria que possui produtos' 
    }, { status: 400 });
  }

  const { error: delErr } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}