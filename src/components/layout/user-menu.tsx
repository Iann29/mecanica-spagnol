// Menu do usuário - Mecânica Spagnol

'use client';

import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/contexts/auth-context';
import { userNav, adminNav } from '@/lib/config/navigation';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, isAdmin, signOut, loading } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
    } catch {
      toast.error('Erro ao fazer logout');
    }
  };

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para obter o primeiro nome
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <button className="p-2 text-muted-foreground animate-pulse" disabled>
        <User className="h-6 w-6" />
        <span className="sr-only">Carregando...</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-[#0252A7] hover:text-[#0252A7]/80 hover:scale-110 hover:rotate-[5deg] transition-all duration-200 cursor-pointer group">
          {user ? (
            <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-[#0252A7] transition-all">
              <AvatarFallback className="bg-[#0252A7] text-white text-sm font-medium">
                {getInitials(user.profile?.full_name || user.email)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-6 w-6" />
          )}
          <span className="sr-only">Menu do usuário</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            {/* Saudação ao usuário */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Olá, {user.profile?.full_name ? getFirstName(user.profile.full_name) : 'Usuário'}!
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />

            {/* Links do usuário */}
            {userNav.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="cursor-pointer">
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}

            {/* Links administrativos (apenas para admins) */}
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Administração</DropdownMenuLabel>
                {adminNav.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />
            
            {/* Logout */}
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* Opções para usuário não logado */}
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer">
                Entrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cadastro" className="cursor-pointer">
                Criar Conta
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}