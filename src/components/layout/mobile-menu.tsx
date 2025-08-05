// Menu mobile - Mecânica Spagnol

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/contexts/auth-context';
import { mainNav, userNav, adminNav } from '@/lib/config/navigation';
import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';

interface MobileMenuProps {
  children: React.ReactNode;
}

export function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, signOut, loading } = useAuthContext();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="p-6 border-b flex items-center justify-between">
            <Link 
              href="/" 
              className="text-lg font-bold"
              onClick={() => setIsOpen(false)}
            >
              {siteConfig.name}
            </Link>
            {/* Carrinho no header do menu */}
            <Link
              href="/carrinho"
              className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="h-6 w-6 text-[#0252A7]" />
              {/* Badge com quantidade de items */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#EF1923] text-white text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Seção do usuário */}
          {user && (
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {getInitials(user.profile?.full_name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.profile?.full_name ? getFirstName(user.profile.full_name) : 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navegação principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-1">
              <nav className="space-y-1">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Seção do usuário logado */}
              {user && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Minha Conta
                    </p>
                    {userNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  {/* Seção administrativa */}
                  {isAdmin && (
                    <div className="space-y-1 mt-4">
                      <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Administração
                      </p>
                      {adminNav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer do menu */}
          <div className="p-6 border-t">
            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cadastro">
                    Criar Conta
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}