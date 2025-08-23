'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid, GridStats } from '@/components/shop/product-grid';
import { ProductFilters } from '@/components/shop/product-filters';
import { getProducts, getCategories, ProductFilters as ProductFiltersType } from '@/lib/api/products';
import { Product, Category } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProductsPageState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  total: number;
  currentPage: number;
  limit: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState<ProductsPageState>({
    products: [],
    categories: [],
    isLoading: true,
    error: null,
    totalPages: 0,
    total: 0,
    currentPage: 1,
    limit: 20,
  });

  // Parse URL params to filters
  const getFiltersFromURL = useCallback((): ProductFiltersType => {
    const filters: ProductFiltersType = {};
    
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (featured === 'true') filters.featured = true;
    if (inStock === 'true') filters.inStock = true;
    
    return filters;
  }, [searchParams]);

  // Parse sort from URL
  const getSortFromURL = useCallback(() => {
    const sort = searchParams.get('sort') || 'created_at-desc';
    const [sortBy, sortOrder] = sort.split('-');
    return { sort, sortBy, sortOrder };
  }, [searchParams]);

  // Parse page from URL
  const getPageFromURL = useCallback(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  }, [searchParams]);

  // Update URL params
  const updateURL = useCallback((params: Record<string, string | number | boolean | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });
    
    router.push(`/loja?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  // Load products
  const loadProducts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const filters = getFiltersFromURL();
      const { sortBy, sortOrder } = getSortFromURL();
      const page = getPageFromURL();
      
      const response = await getProducts({
        filters,
        sortBy: sortBy as 'name' | 'price' | 'created_at',
        sortOrder: sortOrder as 'asc' | 'desc',
        page,
        limit: state.limit,
      });
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          products: response.data!.products,
          totalPages: response.data!.totalPages,
          total: response.data!.total,
          currentPage: response.data!.page,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Erro ao carregar produtos',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro inesperado ao carregar produtos',
        isLoading: false,
      }));
    }
  }, [getFiltersFromURL, getSortFromURL, getPageFromURL, state.limit]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          categories: response.data!,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }, []);

  // Effects
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, searchParams]);

  // Handlers
  const handleFiltersChange = (filters: ProductFiltersType) => {
    updateURL({
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      featured: filters.featured,
      inStock: filters.inStock,
      page: 1, // Reset to page 1 when filters change
    });
  };

  const handleSortChange = (sort: string) => {
    updateURL({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const currentFilters = getFiltersFromURL();
  const currentSort = getSortFromURL().sort;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Loja</h1>
          <p className="text-muted-foreground">
            Encontre as melhores peças e acessórios automotivos
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {state.categories.length > 0 ? (
              <ProductFilters
                categories={state.categories}
                filters={currentFilters}
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                currentSort={currentSort}
                resultsCount={state.total}
              />
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Stats */}
              {!state.isLoading && !state.error && (
                <GridStats
                  total={state.total}
                  page={state.currentPage}
                  limit={state.limit}
                />
              )}

              {/* Error State */}
              {state.error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Products Grid */}
              <ProductGrid
                products={state.products}
                isLoading={state.isLoading}
                error={state.error || undefined}
                currentPage={state.currentPage}
                totalPages={state.totalPages}
                onPageChange={handlePageChange}
                showQuickView={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Note: Metadata should be defined in a separate metadata file or server component
// since this is a client component with 'use client' directive