'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/store/cart';
import { Product } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

export function ProductCard({ product, className, showQuickView = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem, hasItem, getItemQuantity, formatPrice } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock_quantity <= 0) return;
    
    setIsLoading(true);
    try {
      addItem(product, 1);
      // Aqui você pode adicionar um toast de sucesso se desejar
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = hasItem(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock_quantity <= 0;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const finalPrice = product.sale_price || product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const mainImage = product.images?.[0] || '/placeholder-product.jpg';

  return (
    <Card className={cn('group relative overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <Link href={`/loja/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs font-semibold">
                -{discountPercent}%
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="secondary" className="text-xs">
                Destaque
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="outline" className="text-xs">
                Esgotado
              </Badge>
            )}
            {product.stock_quantity <= 5 && !isOutOfStock && (
              <Badge variant="outline" className="text-xs text-orange-600">
                Últimas unidades
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implementar wishlist
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            {showQuickView && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implementar quick view modal
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Product Image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform group-hover:scale-105',
              isOutOfStock && 'grayscale opacity-50'
            )}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <Link href={`/loja/${product.slug}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* SKU */}
          <p className="text-xs text-muted-foreground">
            SKU: {product.sku}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {isOutOfStock ? 'Indisponível' : `${product.stock_quantity} em estoque`}
            </span>
            {isInCart && (
              <span className="text-primary font-medium">
                {cartQuantity} no carrinho
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          size="sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Adicionando...
            </>
          ) : isInCart ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar mais
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao carrinho
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Skeleton component para loading states
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  );
}