// Types do Banco de Dados - Mecânica Spagnol

// Enums
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Interfaces base
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  cpf?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  images: string[];
  specifications: Record<string, unknown>;
  is_featured: boolean;
  is_active: boolean;
  reference?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user?: Profile;
  address_id: string;
  address?: Address;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  notes?: string;
  tracking_code?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface PaymentIntent {
  id: string;
  order_id: string;
  provider?: string;
  external_id?: string;
  amount: number;
  status: PaymentStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  old_price?: number;
  new_price?: number;
  old_sale_price?: number;
  new_sale_price?: number;
  changed_by?: string;
  changed_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
  sku_suffix?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RelatedProduct {
  id: string;
  product_id: string;
  related_product_id: string;
  relation_type: 'related' | 'accessory' | 'substitute' | 'upgrade';
  sort_order: number;
  created_at: string;
  created_by?: string;
}

// Type para criação/atualização (sem campos gerados automaticamente)
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<ProfileInsert>;

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

export type ProductVariantInsert = Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>;
export type ProductVariantUpdate = Partial<ProductVariantInsert>;

export type RelatedProductInsert = Omit<RelatedProduct, 'id' | 'created_at'>;
export type RelatedProductUpdate = Partial<Pick<RelatedProduct, 'relation_type' | 'sort_order'>>;

export type OrderInsert = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>;
export type OrderUpdate = Partial<Pick<Order, 'status' | 'payment_status' | 'tracking_code' | 'notes'>>;

// Type helpers
export type Tables = {
  profiles: Profile;
  categories: Category;
  products: Product;
  product_variants: ProductVariant;
  related_products: RelatedProduct;
  cart_items: CartItem;
  addresses: Address;
  orders: Order;
  order_items: OrderItem;
  payment_intents: PaymentIntent;
  price_history: PriceHistory;
};

export type TableName = keyof Tables;