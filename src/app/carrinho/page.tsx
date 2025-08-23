'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Package, 
  Truck,
  Shield,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const {
    items,
    getTotalItems,
    getSubtotal,
    getShipping,
    getTotal,
    updateQuantity,
    removeItem,
    clearCart,
    formatPrice,
  } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      // Aqui você implementaria a lógica de cupom
      // Por enquanto, vamos simular
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppliedCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const totalItems = getTotalItems();

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground">
              Adicione produtos ao seu carrinho para continuar
            </p>
          </div>
          <Button asChild>
            <Link href="/loja">
              Continuar comprando
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <Badge variant="secondary">
            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar carrinho
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link href={`/loja/${item.product.slug}`}>
                          <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100">
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
                              href={`/loja/${item.product.slug}`}
                              className="font-medium hover:text-primary line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.product.sku}
                            </p>
                            {item.product.category && (
                              <p className="text-sm text-muted-foreground">
                                {item.product.category.name}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price Info */}
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(item.price)} cada
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.product.stock_quantity <= 5 && (
                          <Alert className="mt-2">
                            <Package className="h-4 w-4" />
                            <AlertDescription>
                              Apenas {item.product.stock_quantity} em estoque
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Cupom de Desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">
                      Cupom {appliedCoupon} aplicado
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código do cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      variant="outline"
                    >
                      {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Frete
                    </span>
                    <span className={cn(
                      shipping === 0 ? 'text-green-600 font-medium' : ''
                    )}>
                      {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-{formatPrice(0)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                {shipping === 0 && subtotal < 200 && (
                  <p className="text-sm text-muted-foreground">
                    Frete grátis em compras acima de {formatPrice(200)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">
                Finalizar Compra
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            {/* Continue Shopping */}
            <Button asChild variant="outline" className="w-full">
              <Link href="/loja">
                Continuar Comprando
              </Link>
            </Button>

            {/* Trust Indicators */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Compra 100% segura</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Produtos originais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}