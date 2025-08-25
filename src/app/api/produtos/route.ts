import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import type { ProductInsert } from '@/types/database';

// Schema de validação para criação de produto (compatível com ProductInsert)
const productInsertSchema = z.object({
  sku: z.string().min(1, 'SKU é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  sale_price: z.number().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().default(0),
  category_id: z.number().int(),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.unknown()).default({}),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
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

// GET /api/produtos -> lista com paginação, busca e ordenação
export async function GET(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const pageSize = Math.min(Math.max(parseInt(url.searchParams.get('pageSize') || '10', 10), 1), 100);
  const q = url.searchParams.get('q')?.trim();
  const categoryId = url.searchParams.get('category_id');
  const isActive = url.searchParams.get('is_active');
  const sort = url.searchParams.get('sort') || 'created_at.desc';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(
        id,
        name
      )
    `, { count: 'exact' });

  if (q) {
    // Busca por nome ou sku
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},sku.ilike.${like}`);
  }

  if (categoryId) {
    const idNum = Number(categoryId);
    if (!Number.isNaN(idNum)) {
      query = query.eq('category_id', idNum);
    }
  }

  if (isActive === 'true' || isActive === 'false') {
    query = query.eq('is_active', isActive === 'true');
  }

  // Ordenação
  const [sortColumn, sortDir] = sort.split('.') as [string, 'asc' | 'desc' | undefined];
  if (sortColumn) {
    query = query.order(sortColumn, { ascending: (sortDir || 'desc') === 'asc', nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error: qErr, count } = await query.range(from, to);
  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 400 });
  }

  return NextResponse.json({
    data,
    page,
    pageSize,
    total: count ?? 0,
  });
}

// POST /api/produtos -> cria produto
export async function POST(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = productInsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload: ProductInsert = parsed.data as ProductInsert;

  const { data, error: insErr } = await supabase
    .from('products')
    .insert(payload)
    .select('*')
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
