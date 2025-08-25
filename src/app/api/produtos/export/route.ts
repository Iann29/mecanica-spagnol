import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import { productsToCSVString } from '@/lib/utils/csv';

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

// GET /api/produtos/export -> exporta produtos para CSV
export async function GET(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'csv';
  const isActive = url.searchParams.get('is_active');
  const categoryId = url.searchParams.get('category_id');

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `);

    // Aplicar filtros se fornecidos
    if (isActive === 'true' || isActive === 'false') {
      query = query.eq('is_active', isActive === 'true');
    }

    if (categoryId && !isNaN(parseInt(categoryId))) {
      query = query.eq('category_id', parseInt(categoryId));
    }

    // Ordenar por data de criação
    query = query.order('created_at', { ascending: false });

    const { data: products, error: queryError } = await query;

    if (queryError) {
      console.error('Export query error:', queryError);
      return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Nenhum produto encontrado para exportar' }, { status: 400 });
    }

    if (format === 'csv') {
      const csvString = productsToCSVString(products);
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Retornar CSV como download
      return new NextResponse(csvString, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="produtos-${timestamp}.csv"`,
        },
      });
    } else {
      return NextResponse.json({ error: 'Formato não suportado' }, { status: 400 });
    }

  } catch (error: unknown) {
    console.error('Export error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}