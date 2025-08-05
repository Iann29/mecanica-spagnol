'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Package 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  children?: React.ReactNode;
  className?: string;
}

export function CartDrawer({ children, className }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    getTotalItems,
    getSubtotal,
    getShipping,
    getTotal,
    updateQuantity,
    removeItem,
    formatPrice,
  } = useCart();

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className={cn('relative', className)}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho
            {totalItems > 0 && (
              <Badge variant="secondary">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 py-6">
            {items.length === 0 ? (
              <EmptyCartState />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartDrawerItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={() => removeItem(item.product.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Cart Summary & Actions */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span className={cn(
                    shipping === 0 ? 'text-green-600 font-medium' : ''
                  )}>
                    {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button asChild className="w-full" onClick={handleClose}>
                  <Link href="/checkout">
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={handleClose}>
                  <Link href="/carrinho">
                    Ver Carrinho Completo
                  </Link>
                </Button>
              </div>

              {/* Free Shipping Indicator */}
              {shipping === 0 && subtotal < 200 && (
                <p className="text-xs text-muted-foreground text-center">
                  Frete grátis em compras acima de {formatPrice(200)}
                </p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Cart Item Component
interface CartDrawerItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      slug: string;
      images?: string[];
      stock_quantity: number;
    };
    quantity: number;
    price: number;
  };
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: () => void;
}

function CartDrawerItem({ item, onQuantityChange, onRemove }: CartDrawerItemProps) {
  const { formatPrice } = useCart();

  return (
    <div className="flex gap-3 p-3 border rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/produtos/${item.product.slug}`}>
          <div className="w-16 h-16 relative overflow-hidden rounded-md bg-gray-100">
            <Image
              src={item.product.images?.[0] || '/placeholder-product.jpg'}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Link 
              href={`/produtos/${item.product.slug}`}
              className="font-medium text-sm hover:text-primary line-clamp-2"
            >
              {item.product.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatPrice(item.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-6 w-6 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-6 w-6"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 py-1 text-sm min-w-[30px] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock_quantity}
              className="h-6 w-6"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>

        {/* Stock Warning */}
        {item.product.stock_quantity <= 5 && (
          <p className="text-xs text-orange-600 mt-1">
            Apenas {item.product.stock_quantity} em estoque
          </p>
        )}
      </div>
    </div>
  );
}

// Empty Cart State
function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Carrinho vazio</h3>
        <p className="text-sm text-muted-foreground">
          Adicione produtos ao seu carrinho para vê-los aqui
        </p>
      </div>
      <Button asChild>
        <Link href="/produtos">
          Continuar comprando
        </Link>
      </Button>
    </div>
  );
}

// Mini Cart Drawer for header
export function MiniCartDrawer() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <CartDrawer>
      <button className="relative p-2 text-[#0252A7] hover:text-[#0252A7]/80 hover:scale-110 hover:rotate-[5deg] transition-all duration-200 cursor-pointer">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
            {totalItems}
          </Badge>
        )}
        <span className="sr-only">Carrinho</span>
      </button>
    </CartDrawer>
  );
}

// Quick Add to Cart Drawer
interface QuickAddDrawerProps {
  trigger: React.ReactNode;
  productId: string;
  onAddToCart: () => void;
}

export function QuickAddDrawer({ trigger, productId, onAddToCart }: QuickAddDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Produto adicionado!</SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
          <p className="text-muted-foreground mb-4">
            O produto foi adicionado ao seu carrinho com sucesso.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/checkout">
                Finalizar Compra
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/produtos">
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}