import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';

// Schema de validação para criação de categoria
const categoryInsertSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
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

// GET /api/categorias -> lista com paginação e busca
export async function GET(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const pageSize = Math.min(Math.max(parseInt(url.searchParams.get('pageSize') || '10', 10), 1), 100);
  const q = url.searchParams.get('q')?.trim();
  const isActive = url.searchParams.get('is_active');
  const sort = url.searchParams.get('sort') || 'name.asc';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('categories')
    .select('*', { count: 'exact' });

  if (q) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},description.ilike.${like}`);
  }

  if (isActive === 'true' || isActive === 'false') {
    query = query.eq('is_active', isActive === 'true');
  }

  // Ordenação
  const [sortColumn, sortDir] = sort.split('.') as [string, 'asc' | 'desc' | undefined];
  if (sortColumn) {
    query = query.order(sortColumn, { ascending: (sortDir || 'asc') === 'asc', nullsFirst: false });
  } else {
    query = query.order('name', { ascending: true });
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

// POST /api/categorias -> cria categoria
export async function POST(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = categoryInsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verificar se slug já existe
  const { data: existingSlug } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', parsed.data.slug)
    .single();

  if (existingSlug) {
    return NextResponse.json({ error: 'Slug já existe' }, { status: 400 });
  }

  // Verificar se nome já existe
  const { data: existingName } = await supabase
    .from('categories')
    .select('id')
    .eq('name', parsed.data.name)
    .single();

  if (existingName) {
    return NextResponse.json({ error: 'Nome já existe' }, { status: 400 });
  }

  const { data, error: insErr } = await supabase
    .from('categories')
    .insert(parsed.data)
    .select('*')
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}