import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';
import { parseCSVString, csvToProduct, validateProductCSV } from '@/lib/utils/csv';
import type { ProductInsert } from '@/types/database';

const importSchema = z.object({
  csvData: z.string().min(1, 'Dados CSV são obrigatórios'),
  overwrite: z.boolean().default(false),
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

// POST /api/produtos/import -> valida CSV
export async function POST(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = importSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { csvData, overwrite } = parsed.data;

  try {
    // Parse CSV
    const csvRows = parseCSVString(csvData);
    
    if (csvRows.length === 0) {
      return NextResponse.json({ error: 'CSV vazio ou inválido' }, { status: 400 });
    }

    // Buscar SKUs existentes para validação
    const { data: existingProducts } = await supabase
      .from('products')
      .select('sku');

    const existingSKUs = existingProducts?.map(p => p.sku) || [];

    // Validar dados CSV
    const validationErrors = validateProductCSV(csvRows, overwrite ? [] : existingSKUs);
    
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Dados inválidos',
        validationErrors 
      }, { status: 400 });
    }

    // Converter CSV para produtos
    const products = csvRows.map(csvToProduct);

    // Retornar dados válidos para preview
    return NextResponse.json({
      success: true,
      preview: products,
      count: products.length,
      message: `${products.length} produto(s) prontos para importar`
    });

  } catch (error: unknown) {
    console.error('Import validation error:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar CSV' 
    }, { status: 500 });
  }
}

// PUT /api/produtos/import -> executa importação
export async function PUT(request: Request) {
  const { supabase, error } = await getAuthorizedClient();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = importSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { csvData, overwrite } = parsed.data;

  try {
    // Parse e valida novamente (por segurança)
    const csvRows = parseCSVString(csvData);
    const products = csvRows.map(csvToProduct);

    const results = {
      created: 0,
      updated: 0,
      errors: [] as Array<{ sku: string; error: string }>
    };

    // Processar cada produto individualmente
    for (const productData of products) {
      try {
        const sku = productData.sku;
        if (!sku) continue;

        // Verificar se já existe
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('sku', sku)
          .single();

        if (existing && !overwrite) {
          results.errors.push({ 
            sku, 
            error: 'Produto já existe (use modo sobrescrever)' 
          });
          continue;
        }

        // Remover campos undefined/null para insert/update
        const cleanData = Object.fromEntries(
          Object.entries(productData).filter(([_, value]) => value !== undefined && value !== '')
        ) as ProductInsert;

        if (existing && overwrite) {
          // Atualizar produto existente
          const { error: updateError } = await supabase
            .from('products')
            .update(cleanData)
            .eq('id', existing.id);

          if (updateError) {
            results.errors.push({ 
              sku, 
              error: updateError.message 
            });
          } else {
            results.updated++;
          }
        } else {
          // Criar novo produto
          const { error: insertError } = await supabase
            .from('products')
            .insert(cleanData);

          if (insertError) {
            results.errors.push({ 
              sku, 
              error: insertError.message 
            });
          } else {
            results.created++;
          }
        }

      } catch (productError: unknown) {
        const errorMessage = productError instanceof Error ? productError.message : 'Erro desconhecido';
        results.errors.push({ 
          sku: productData.sku || 'desconhecido', 
          error: errorMessage 
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Importação concluída: ${results.created} criados, ${results.updated} atualizados, ${results.errors.length} erros`
    });

  } catch (error: unknown) {
    console.error('Import execution error:', error);
    return NextResponse.json({ 
      error: 'Erro ao executar importação' 
    }, { status: 500 });
  }
}