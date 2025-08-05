'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  href?: string;
  onClick?: () => void;
}

export function CartButton({ 
  className,
  variant = 'ghost',
  size = 'icon',
  showText = false,
  href = '/carrinho',
  onClick
}: CartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { getTotalItems } = useCart();
  
  const totalItems = getTotalItems();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    // Animate the button when clicked
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  };

  const buttonContent = (
    <div className="relative">
      <div className={cn(
        'transition-transform duration-150',
        isAnimating && 'scale-95'
      )}>
        {showText ? (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <span>Carrinho</span>
          </div>
        ) : (
          <ShoppingCart className="h-6 w-6" />
        )}
      </div>
      
      {/* Badge with item count */}
      {totalItems > 0 && (
        <Badge 
          className={cn(
            'absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center',
            'bg-primary text-primary-foreground',
            'transition-all duration-200',
            isAnimating && 'scale-110'
          )}
        >
          <span className="text-xs font-semibold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </Badge>
      )}
    </div>
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className={cn('relative p-2 text-[#0252A7] hover:text-[#0252A7]/80 hover:scale-110 hover:rotate-[5deg] transition-all duration-200 cursor-pointer', className)}
        aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      >
        {buttonContent}
      </button>
    );
  }

  // Otherwise render as link
  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className={cn('relative p-2 text-[#0252A7] hover:text-[#0252A7]/80 hover:scale-110 hover:rotate-[5deg] transition-all duration-200 cursor-pointer', className)}
      aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
    >
      {buttonContent}
    </Link>
  );
}

// Alternative cart button with shopping bag icon
export function CartBagButton(props: CartButtonProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant={props.variant || 'ghost'}
      size={props.size || 'icon'}
      className={cn('relative', props.className)}
      onClick={props.onClick}
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
            {totalItems}
          </Badge>
        )}
      </div>
    </Button>
  );
}

// Floating cart button for mobile
export function FloatingCartButton() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden">
      <CartButton
        size="default"
        className="rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground"
        variant="default"
        showText={false}
      />
    </div>
  );
}

// Mini cart button for quick access
export function MiniCartButton() {
  const { getTotalItems, getTotal, formatPrice } = useCart();
  const totalItems = getTotalItems();
  const total = getTotal();

  return (
    <div className="flex items-center gap-2">
      <CartButton size="sm" />
      <div className="hidden sm:block text-sm">
        <div className="font-medium">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </div>
        <div className="text-muted-foreground">
          {formatPrice(total)}
        </div>
      </div>
    </div>
  );
}