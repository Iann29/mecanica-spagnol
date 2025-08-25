import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import type { ProductUpdate } from '@/types/database';

// Schema de atualização (parcial)
const productUpdateSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  sale_price: z.number().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  category_id: z.number().int().optional(),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  reference: z.string().max(100).optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
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

// GET /api/produtos/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id } = await params;
  const { data, error: qErr } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/produtos/[id]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload: ProductUpdate = parsed.data as ProductUpdate;
  const { id } = await params;

  const { data, error: upErr } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/produtos/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const { id } = await params;
  const { error: delErr } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
