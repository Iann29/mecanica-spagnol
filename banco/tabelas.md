create table public.addresses (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  cep text not null,
  street text not null,
  number text not null,
  complement text null,
  neighborhood text not null,
  city text not null,
  state text not null,
  is_default boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint addresses_pkey primary key (id),
  constraint addresses_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.cart_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  product_id uuid null,
  quantity integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cart_items_pkey primary key (id),
  constraint cart_items_user_id_product_id_key unique (user_id, product_id),
  constraint cart_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint cart_items_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint cart_items_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;

create trigger update_cart_items_updated_at BEFORE
update on cart_items for EACH row
execute FUNCTION update_updated_at ();

create table public.categories (
  id serial not null,
  name text not null,
  slug text not null,
  description text null,
  image_url text null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_name_key unique (name),
  constraint categories_slug_key unique (slug)
) TABLESPACE pg_default;

create table public.order_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_id uuid null,
  product_id uuid null,
  product_name text not null,
  product_sku text not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id),
  constraint order_items_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;

create table public.orders (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_number text not null,
  user_id uuid null,
  address_id uuid null,
  status public.order_status null default 'pending'::order_status,
  payment_status public.payment_status null default 'pending'::payment_status,
  subtotal numeric(10, 2) not null,
  shipping_cost numeric(10, 2) null default 0,
  discount numeric(10, 2) null default 0,
  total numeric(10, 2) not null,
  notes text null,
  tracking_code text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_order_number_key unique (order_number),
  constraint orders_address_id_fkey foreign KEY (address_id) references addresses (id),
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_orders_user on public.orders using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_orders_created on public.orders using btree (created_at desc) TABLESPACE pg_default;

create trigger generate_order_number_trigger BEFORE INSERT on orders for EACH row
execute FUNCTION generate_order_number ();

create trigger update_orders_updated_at BEFORE
update on orders for EACH row
execute FUNCTION update_updated_at ();

create table public.payment_intents (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_id uuid null,
  provider text null,
  external_id text null,
  amount numeric(10, 2) not null,
  status public.payment_status null default 'pending'::payment_status,
  metadata jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint payment_intents_pkey primary key (id),
  constraint payment_intents_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.products (
  id uuid not null default extensions.uuid_generate_v4 (),
  sku text not null,
  name text not null,
  slug text not null,
  description text null,
  price numeric(10, 2) not null,
  sale_price numeric(10, 2) null,
  stock_quantity integer null default 0,
  category_id integer null,
  images jsonb null default '[]'::jsonb,
  specifications jsonb null default '{}'::jsonb,
  is_featured boolean null default false,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_sku_key unique (sku),
  constraint products_slug_key unique (slug),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id),
  constraint products_sale_price_check check ((sale_price >= (0)::numeric)),
  constraint products_price_check check ((price >= (0)::numeric)),
  constraint products_stock_quantity_check check ((stock_quantity >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_products_category on public.products using btree (category_id) TABLESPACE pg_default;

create index IF not exists idx_products_slug on public.products using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_products_sku on public.products using btree (sku) TABLESPACE pg_default;

create index IF not exists idx_products_active on public.products using btree (is_active) TABLESPACE pg_default;

create trigger update_products_updated_at BEFORE
update on products for EACH row
execute FUNCTION update_updated_at ();

create table public.profiles (
  id uuid not null,
  email text not null,
  full_name text null,
  phone text null,
  cpf text null,
  role public.user_role null default 'customer'::user_role,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_cpf_key unique (cpf),
  constraint profiles_email_key unique (email),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION update_updated_at ();

