-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.addresses (
  user_id uuid,
  cep text NOT NULL,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.cart_items (
  user_id uuid,
  product_id uuid,
  quantity integer NOT NULL CHECK (quantity > 0),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.categories (
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_items (
  order_id uuid,
  product_id uuid,
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  order_number text NOT NULL UNIQUE,
  user_id uuid,
  address_id uuid,
  subtotal numeric NOT NULL,
  total numeric NOT NULL,
  notes text,
  tracking_code text,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  status USER-DEFINED DEFAULT 'pending'::order_status,
  payment_status USER-DEFINED DEFAULT 'pending'::payment_status,
  shipping_cost numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.payment_intents (
  order_id uuid,
  provider text,
  external_id text,
  amount numeric NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  status USER-DEFINED DEFAULT 'pending'::payment_status,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_intents_pkey PRIMARY KEY (id),
  CONSTRAINT payment_intents_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.price_history (
  product_id uuid NOT NULL,
  old_price numeric,
  new_price numeric,
  old_sale_price numeric,
  new_sale_price numeric,
  changed_by uuid,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  changed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT price_history_pkey PRIMARY KEY (id),
  CONSTRAINT price_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id),
  CONSTRAINT price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.product_variants (
  product_id uuid NOT NULL,
  name character varying NOT NULL,
  value character varying NOT NULL,
  sku_suffix character varying,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  price_modifier numeric DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  meta_title character varying,
  meta_description text,
  meta_keywords text,
  reference character varying,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  sale_price numeric CHECK (sale_price >= 0::numeric),
  category_id integer,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  images jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  cpf text UNIQUE,
  role USER-DEFINED DEFAULT 'customer'::user_role,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.related_products (
  product_id uuid NOT NULL,
  related_product_id uuid NOT NULL,
  created_by uuid,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  relation_type character varying DEFAULT 'related'::character varying,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT related_products_pkey PRIMARY KEY (id),
  CONSTRAINT related_products_related_product_id_fkey FOREIGN KEY (related_product_id) REFERENCES public.products(id),
  CONSTRAINT related_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT related_products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);