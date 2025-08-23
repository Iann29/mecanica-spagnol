# Ver todos indices

<estrutura-em-markdown>
| schemaname | tablename       | indexname                         | indexdef                                                                                                     |
| ---------- | --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| public     | addresses       | addresses_pkey                    | CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id)                                      |
| public     | cart_items      | cart_items_pkey                   | CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id)                                    |
| public     | cart_items      | cart_items_user_id_product_id_key | CREATE UNIQUE INDEX cart_items_user_id_product_id_key ON public.cart_items USING btree (user_id, product_id) |
| public     | categories      | categories_name_key               | CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name)                              |
| public     | categories      | categories_pkey                   | CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id)                                    |
| public     | categories      | categories_slug_key               | CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug)                              |
| public     | order_items     | order_items_pkey                  | CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id)                                  |
| public     | orders          | idx_orders_created                | CREATE INDEX idx_orders_created ON public.orders USING btree (created_at DESC)                               |
| public     | orders          | idx_orders_status                 | CREATE INDEX idx_orders_status ON public.orders USING btree (status)                                         |
| public     | orders          | idx_orders_user                   | CREATE INDEX idx_orders_user ON public.orders USING btree (user_id)                                          |
| public     | orders          | orders_order_number_key           | CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number)                      |
| public     | orders          | orders_pkey                       | CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id)                                            |
| public     | payment_intents | payment_intents_pkey              | CREATE UNIQUE INDEX payment_intents_pkey ON public.payment_intents USING btree (id)                          |
| public     | products        | idx_products_active               | CREATE INDEX idx_products_active ON public.products USING btree (is_active)                                  |
| public     | products        | idx_products_category             | CREATE INDEX idx_products_category ON public.products USING btree (category_id)                              |
| public     | products        | idx_products_sku                  | CREATE INDEX idx_products_sku ON public.products USING btree (sku)                                           |
| public     | products        | idx_products_slug                 | CREATE INDEX idx_products_slug ON public.products USING btree (slug)                                         |
| public     | products        | products_pkey                     | CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id)                                        |
| public     | products        | products_sku_key                  | CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku)                                    |
| public     | products        | products_slug_key                 | CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug)                                  |
| public     | profiles        | profiles_cpf_key                  | CREATE UNIQUE INDEX profiles_cpf_key ON public.profiles USING btree (cpf)                                    |
| public     | profiles        | profiles_email_key                | CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)                                |
| public     | profiles        | profiles_pkey                     | CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)                                        |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "schemaname": "public",
    "tablename": "addresses",
    "indexname": "addresses_pkey",
    "indexdef": "CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "cart_items",
    "indexname": "cart_items_pkey",
    "indexdef": "CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "cart_items",
    "indexname": "cart_items_user_id_product_id_key",
    "indexdef": "CREATE UNIQUE INDEX cart_items_user_id_product_id_key ON public.cart_items USING btree (user_id, product_id)"
  },
  {
    "schemaname": "public",
    "tablename": "categories",
    "indexname": "categories_name_key",
    "indexdef": "CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name)"
  },
  {
    "schemaname": "public",
    "tablename": "categories",
    "indexname": "categories_pkey",
    "indexdef": "CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "categories",
    "indexname": "categories_slug_key",
    "indexdef": "CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug)"
  },
  {
    "schemaname": "public",
    "tablename": "order_items",
    "indexname": "order_items_pkey",
    "indexdef": "CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "indexname": "idx_orders_created",
    "indexdef": "CREATE INDEX idx_orders_created ON public.orders USING btree (created_at DESC)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "indexname": "idx_orders_status",
    "indexdef": "CREATE INDEX idx_orders_status ON public.orders USING btree (status)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "indexname": "idx_orders_user",
    "indexdef": "CREATE INDEX idx_orders_user ON public.orders USING btree (user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "indexname": "orders_order_number_key",
    "indexdef": "CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "indexname": "orders_pkey",
    "indexdef": "CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "payment_intents",
    "indexname": "payment_intents_pkey",
    "indexdef": "CREATE UNIQUE INDEX payment_intents_pkey ON public.payment_intents USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "idx_products_active",
    "indexdef": "CREATE INDEX idx_products_active ON public.products USING btree (is_active)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "idx_products_category",
    "indexdef": "CREATE INDEX idx_products_category ON public.products USING btree (category_id)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "idx_products_sku",
    "indexdef": "CREATE INDEX idx_products_sku ON public.products USING btree (sku)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "idx_products_slug",
    "indexdef": "CREATE INDEX idx_products_slug ON public.products USING btree (slug)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "products_pkey",
    "indexdef": "CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "products_sku_key",
    "indexdef": "CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku)"
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "indexname": "products_slug_key",
    "indexdef": "CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "indexname": "profiles_cpf_key",
    "indexdef": "CREATE UNIQUE INDEX profiles_cpf_key ON public.profiles USING btree (cpf)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "indexname": "profiles_email_key",
    "indexdef": "CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "indexname": "profiles_pkey",
    "indexdef": "CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)"
  }
]
</estrutura-em-json>