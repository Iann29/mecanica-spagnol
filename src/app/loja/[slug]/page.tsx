'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGrid } from '@/components/shop/product-grid';
import { getProductBySlug, getRelatedProducts } from '@/lib/api/products';
import { useCart } from '@/store/cart';
import { Product } from '@/types/database';
import { cn } from '@/lib/utils';

interface ProductDetailsState {
  product: Product | null;
  relatedProducts: Product[];
  isLoading: boolean;
  error: string | null;
  selectedImageIndex: number;
  quantity: number;
  isAddingToCart: boolean;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [state, setState] = useState<ProductDetailsState>({
    product: null,
    relatedProducts: [],
    isLoading: true,
    error: null,
    selectedImageIndex: 0,
    quantity: 1,
    isAddingToCart: false,
  });

  const { addItem, hasItem, getItemQuantity, formatPrice, canAddToCart } = useCart();

  // Load product details
  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await getProductBySlug(slug);
        
        if (response.success && response.data) {
          const product = response.data;
          setState(prev => ({
            ...prev,
            product,
            isLoading: false,
          }));

          // Load related products
          if (product.category_id) {
            const relatedResponse = await getRelatedProducts(
              product.id,
              product.category_id,
              4
            );
            
            if (relatedResponse.success && relatedResponse.data) {
              setState(prev => ({
                ...prev,
                relatedProducts: relatedResponse.data!.products,
              }));
            }
          }
        } else {
          setState(prev => ({
            ...prev,
            error: response.error || 'Produto não encontrado',
            isLoading: false,
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Erro ao carregar produto',
          isLoading: false,
        }));
      }
    };

    loadProduct();
  }, [slug]);

  // Handlers
  const handleAddToCart = async () => {
    if (!state.product || !canAddToCart(state.product, state.quantity)) return;

    setState(prev => ({ ...prev, isAddingToCart: true }));
    
    try {
      addItem(state.product, state.quantity);
      // Aqui você pode adicionar um toast de sucesso
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setState(prev => ({ ...prev, isAddingToCart: false }));
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!state.product) return;
    
    const newQuantity = Math.max(1, Math.min(state.quantity + delta, state.product.stock_quantity));
    setState(prev => ({ ...prev, quantity: newQuantity }));
  };

  const handleImageSelect = (index: number) => {
    setState(prev => ({ ...prev, selectedImageIndex: index }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: state.product?.name,
          text: state.product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback - copiar para clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (state.isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (state.error || !state.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error || 'Produto não encontrado'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { product } = state;
  const isInCart = hasItem(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock_quantity <= 0;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const finalPrice = product.sale_price || product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder-product.jpg'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Início</Link>
          <span>/</span>
          <Link href="/loja" className="hover:text-primary">Loja</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link 
                href={`/loja?category=${product.category.id}`}
                className="hover:text-primary"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={images[state.selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="destructive">
                    -{discountPercent}%
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary">Destaque</Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="outline">Esgotado</Badge>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={cn(
                      'aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2',
                      index === state.selectedImageIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {/* Category */}
              {product.category && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {product.category.name}
                </p>
              )}
              
              {/* Product Name */}
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              {/* SKU */}
              <p className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  Você economiza {formatPrice(product.price - finalPrice)}
                </p>
              )}
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {isOutOfStock ? (
                  <span className="text-red-600">Produto esgotado</span>
                ) : product.stock_quantity <= 5 ? (
                  <span className="text-orange-600">
                    Apenas {product.stock_quantity} em estoque
                  </span>
                ) : (
                  <span className="text-green-600">Em estoque</span>
                )}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={state.quantity <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[50px] text-center">
                    {state.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={state.quantity >= product.stock_quantity}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {isInCart && (
                  <span className="text-sm text-muted-foreground">
                    {cartQuantity} no carrinho
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || state.isAddingToCart}
                  size="lg"
                >
                  {state.isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao carrinho
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Garantia</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card>
          <Tabs defaultValue="description" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="specifications">Especificações</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <TabsContent value="description" className="space-y-4">
                <div className="prose max-w-none">
                  {product.description ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Nenhuma descrição disponível para este produto.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma especificação disponível para este produto.
                  </p>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {state.relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Produtos relacionados</h2>
            <ProductGrid
              products={state.relatedProducts}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton
function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}