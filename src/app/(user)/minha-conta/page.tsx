// Dashboard da Área do Usuário - Mecânica Spagnol

'use client';

import { useAuthContext } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, MapPin, Shield, ShoppingCart, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MinhaContaPage() {
  const { user } = useAuthContext();

  const quickActions = [
    {
      title: 'Meus Dados',
      description: 'Atualize suas informações',
      icon: User,
      href: '/minha-conta/perfil',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Meus Pedidos',
      description: 'Acompanhe suas compras',
      icon: Package,
      href: '/meus-pedidos',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Endereços',
      description: 'Gerencie locais de entrega',
      icon: MapPin,
      href: '/minha-conta/enderecos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Segurança',
      description: 'Altere sua senha',
      icon: Shield,
      href: '/minha-conta/seguranca',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) de volta, {user?.profile?.full_name || user?.email}!
        </p>
      </div>

      {/* Resumo de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Total de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum pedido ainda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Carrinho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Itens no carrinho
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Endereços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dados do Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Seus dados cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-muted-foreground">Nome completo</dt>
              <dd className="font-medium">{user?.profile?.full_name || 'Não informado'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Telefone</dt>
              <dd className="font-medium">{user?.profile?.phone || 'Não informado'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">CPF</dt>
              <dd className="font-medium">{user?.profile?.cpf || 'Não informado'}</dd>
            </div>
          </dl>
          <Link href="/minha-conta/perfil">
            <Button variant="outline" className="mt-4">
              Editar Perfil
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <Icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Seus últimos pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Você ainda não fez nenhum pedido</p>
            <Link href="/loja">
              <Button className="mt-4">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}