import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser, checkIsAdmin } from '@/lib/supabase/auth-server';

export async function GET() {
  try {
    // Verificar autenticação e permissão admin
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    
    const isAdmin = await checkIsAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const supabase = await createClient();
    
    // Buscar métricas em paralelo para melhor performance
    const [
      ordersResult,
      customersResult,
      revenueResult,
      lastMonthRevenueResult,
      recentOrdersResult
    ] = await Promise.all([
      // Total de pedidos este mês
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      
      // Total de clientes cadastrados
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }),
      
      // Receita deste mês
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .in('status', ['paid', 'shipped', 'delivered']),
      
      // Receita do mês passado (para calcular crescimento)
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
        .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .in('status', ['paid', 'shipped', 'delivered']),
      
      // Pedidos recentes (últimos 5)
      supabase
        .from('orders')
        .select(`
          id,
          status,
          total,
          created_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Calcular totais
    const totalOrders = ordersResult.count || 0;
    const totalCustomers = customersResult.count || 0;
    
    // Calcular receita atual
    const currentRevenue = revenueResult.data?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;
    
    // Calcular receita do mês passado
    const lastMonthRevenue = lastMonthRevenueResult.data?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;
    
    // Calcular crescimento percentual
    let growthPercentage = 0;
    if (lastMonthRevenue > 0) {
      growthPercentage = ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentRevenue > 0) {
      growthPercentage = 100; // Se não tinha receita no mês passado mas tem agora
    }

    return NextResponse.json({
      metrics: {
        totalOrders,
        totalCustomers,
        currentRevenue,
        growthPercentage: growthPercentage.toFixed(1),
      },
      recentOrders: recentOrdersResult.data || [],
    });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas do dashboard' },
      { status: 500 }
    );
  }
}