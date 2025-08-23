// Funções de permissões e autorização - Mecânica Spagnol

import { AuthUser } from '@/lib/supabase/auth';
import { UserRole } from '@/types/database';

// Verificar se usuário é admin
export function checkIsAdmin(user: AuthUser | null): boolean {
  if (!user || !user.profile) return false;
  return user.profile.role === 'admin';
}

// Verificar se usuário é dono do recurso
export function checkIsOwner(
  user: AuthUser | null, 
  resourceOwnerId: string
): boolean {
  if (!user) return false;
  return user.id === resourceOwnerId;
}

// Verificar se usuário pode acessar rota
export function canAccessRoute(
  user: AuthUser | null,
  route: string
): boolean {
  // Rotas públicas
  const publicRoutes = ['/', '/sobre', '/contato', '/loja'];
  if (publicRoutes.some(r => route.startsWith(r))) {
    return true;
  }

  // Rotas de autenticação (só podem ser acessadas por não logados)
  const authRoutes = ['/login', '/cadastro', '/recuperar-senha'];
  if (authRoutes.some(r => route.startsWith(r))) {
    return !user; // Só pode acessar se NÃO estiver logado
  }

  // Daqui pra frente, precisa estar logado
  if (!user) return false;

  // Rotas de usuário autenticado
  const userRoutes = ['/minha-conta', '/checkout'];
  if (userRoutes.some(r => route.startsWith(r))) {
    return true; // Qualquer usuário logado pode acessar
  }

  // Rotas de admin
  const adminRoutes = ['/admin'];
  if (adminRoutes.some(r => route.startsWith(r))) {
    return checkIsAdmin(user);
  }

  // Por padrão, permite acesso
  return true;
}

// Verificar se usuário pode realizar ação em recurso
export function canPerformAction(
  user: AuthUser | null,
  action: string,
  resource: string,
  resourceOwnerId?: string
): boolean {
  if (!user) return false;

  // Admin pode fazer tudo
  if (checkIsAdmin(user)) return true;

  // Ações em perfil próprio
  if (resource === 'profile' && resourceOwnerId) {
    if (action === 'read' || action === 'update') {
      return checkIsOwner(user, resourceOwnerId);
    }
  }

  // Ações em pedidos próprios
  if (resource === 'order' && resourceOwnerId) {
    if (action === 'read') {
      return checkIsOwner(user, resourceOwnerId);
    }
    if (action === 'create') {
      return true; // Qualquer usuário logado pode criar pedido
    }
  }

  // Ações em carrinho próprio
  if (resource === 'cart') {
    return ['read', 'update', 'delete'].includes(action);
  }

  // Ações em endereços próprios
  if (resource === 'address' && resourceOwnerId) {
    if (['read', 'create', 'update', 'delete'].includes(action)) {
      return checkIsOwner(user, resourceOwnerId);
    }
  }

  // Ações em produtos (apenas admin pode criar/editar/deletar)
  if (resource === 'product') {
    if (action === 'read') return true; // Qualquer um pode ver produtos
    return false; // Só admin pode criar/editar/deletar
  }

  return false;
}

// Obter role do usuário
export function getUserRole(user: AuthUser | null): UserRole | null {
  if (!user || !user.profile) return null;
  return user.profile.role;
}

// Verificar múltiplas permissões
export function hasAnyPermission(
  user: AuthUser | null,
  permissions: Array<{ action: string; resource: string; resourceOwnerId?: string }>
): boolean {
  return permissions.some(p => 
    canPerformAction(user, p.action, p.resource, p.resourceOwnerId)
  );
}

// Verificar todas as permissões
export function hasAllPermissions(
  user: AuthUser | null,
  permissions: Array<{ action: string; resource: string; resourceOwnerId?: string }>
): boolean {
  return permissions.every(p => 
    canPerformAction(user, p.action, p.resource, p.resourceOwnerId)
  );
}