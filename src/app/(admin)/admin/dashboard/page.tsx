// Dashboard Admin - Mecânica Spagnol

'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Constantes do dashboard - evita recriação a cada render
const DASHBOARD_STATS = [
  {
    title: 'Total de Pedidos',
    value: '0',
    description: 'Este mês',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Clientes',
    value: '0',
    description: 'Cadastrados',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Receita',
    value: 'R$ 0,00',
    description: 'Este mês',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    title: 'Crescimento',
    value: '0%',
    description: 'Comparado ao mês anterior',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
] as const;

interface DashboardMetrics {
  totalOrders: number;
  totalCustomers: number;
  currentRevenue: number;
  growthPercentage: string;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/metrics');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      
      const data = await response.json();
      setMetrics(data.metrics);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar valores dos stats com dados reais
  const getStatsWithData = () => {
    if (!metrics) return DASHBOARD_STATS;
    
    return [
      {
        ...DASHBOARD_STATS[0],
        value: metrics.totalOrders.toString(),
      },
      {
        ...DASHBOARD_STATS[1],
        value: metrics.totalCustomers.toString(),
      },
      {
        ...DASHBOARD_STATS[2],
        value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(metrics.currentRevenue),
      },
      {
        ...DASHBOARD_STATS[3],
        value: `${metrics.growthPercentage}%`,
        color: parseFloat(metrics.growthPercentage) > 0 ? 'text-green-600' : 
               parseFloat(metrics.growthPercentage) < 0 ? 'text-red-600' : 'text-gray-600',
        bgColor: parseFloat(metrics.growthPercentage) > 0 ? 'bg-green-100' : 
                 parseFloat(metrics.growthPercentage) < 0 ? 'bg-red-100' : 'bg-gray-100',
      },
    ];
  };

  const stats = getStatsWithData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a), {user?.profile?.full_name || 'Administrador'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton loaders durante carregamento
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerencie seu e-commerce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link 
                href="/admin/produtos" 
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gerenciar Produtos
              </Link>
              <Link 
                href="/admin/pedidos" 
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ver Pedidos
              </Link>
              <Link 
                href="/admin/clientes" 
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gerenciar Clientes
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Últimos pedidos recebidos</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {order.profiles?.full_name || 'Cliente'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(order.total)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status === 'paid' ? 'Pago' :
                         order.status === 'pending' ? 'Pendente' :
                         order.status === 'cancelled' ? 'Cancelado' :
                         order.status === 'shipped' ? 'Enviado' :
                         order.status === 'delivered' ? 'Entregue' :
                         order.status}
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/admin/pedidos"
                  className="block text-center text-sm text-primary hover:underline mt-2"
                >
                  Ver todos os pedidos →
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum pedido ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}