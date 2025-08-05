'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/user-menu';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { CartButton } from '@/components/cart/cart-button';
import { MiniCartDrawer } from '@/components/cart/cart-drawer';
import { SearchBar } from '@/components/layout/search-bar';
import { mainNav } from '@/lib/config/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo-spagnol.png"
              alt="Spagnol Mecânica Agrícola"
              width={220}
              height={75}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block max-w-2xl ml-16">
            <SearchBar />
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center flex-1 justify-center space-x-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-base font-medium transition-colors hover:text-[#0252A7] whitespace-nowrap',
                  pathname === item.href
                    ? 'text-[#0252A7]'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Cart Drawer (Desktop) */}
            <div className="hidden md:block">
              <MiniCartDrawer />
            </div>

            {/* Cart Button (Mobile) */}
            <div className="md:hidden">
              <CartButton />
            </div>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu */}
            <MobileMenu>
              <button className="md:hidden p-2 text-[#0252A7] hover:text-[#0252A7]/80 transition-colors">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </button>
            </MobileMenu>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}