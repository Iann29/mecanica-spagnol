# Listar todas as constraints

<estrutura-em-markdown>
| table_name      | constraint_name                   | constraint_type | column_name  | check_clause                 |
| --------------- | --------------------------------- | --------------- | ------------ | ---------------------------- |
| addresses       | 2200_17303_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| addresses       | 2200_17303_3_not_null             | CHECK           | null         | cep IS NOT NULL              |
| addresses       | 2200_17303_4_not_null             | CHECK           | null         | street IS NOT NULL           |
| addresses       | 2200_17303_5_not_null             | CHECK           | null         | number IS NOT NULL           |
| addresses       | 2200_17303_7_not_null             | CHECK           | null         | neighborhood IS NOT NULL     |
| addresses       | 2200_17303_8_not_null             | CHECK           | null         | city IS NOT NULL             |
| addresses       | 2200_17303_9_not_null             | CHECK           | null         | state IS NOT NULL            |
| addresses       | addresses_user_id_fkey            | FOREIGN KEY     | user_id      | null                         |
| addresses       | addresses_pkey                    | PRIMARY KEY     | id           | null                         |
| cart_items      | 2200_17281_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| cart_items      | 2200_17281_4_not_null             | CHECK           | null         | quantity IS NOT NULL         |
| cart_items      | cart_items_quantity_check         | CHECK           | null         | (quantity > 0)               |
| cart_items      | cart_items_product_id_fkey        | FOREIGN KEY     | product_id   | null                         |
| cart_items      | cart_items_user_id_fkey           | FOREIGN KEY     | user_id      | null                         |
| cart_items      | cart_items_pkey                   | PRIMARY KEY     | id           | null                         |
| cart_items      | cart_items_user_id_product_id_key | UNIQUE          | product_id   | null                         |
| cart_items      | cart_items_user_id_product_id_key | UNIQUE          | user_id      | null                         |
| categories      | 2200_17232_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| categories      | 2200_17232_2_not_null             | CHECK           | null         | name IS NOT NULL             |
| categories      | 2200_17232_3_not_null             | CHECK           | null         | slug IS NOT NULL             |
| categories      | categories_pkey                   | PRIMARY KEY     | id           | null                         |
| categories      | categories_name_key               | UNIQUE          | name         | null                         |
| categories      | categories_slug_key               | UNIQUE          | slug         | null                         |
| order_items     | 2200_17351_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| order_items     | 2200_17351_4_not_null             | CHECK           | null         | product_name IS NOT NULL     |
| order_items     | 2200_17351_5_not_null             | CHECK           | null         | product_sku IS NOT NULL      |
| order_items     | 2200_17351_6_not_null             | CHECK           | null         | quantity IS NOT NULL         |
| order_items     | 2200_17351_7_not_null             | CHECK           | null         | unit_price IS NOT NULL       |
| order_items     | 2200_17351_8_not_null             | CHECK           | null         | total_price IS NOT NULL      |
| order_items     | order_items_quantity_check        | CHECK           | null         | (quantity > 0)               |
| order_items     | order_items_order_id_fkey         | FOREIGN KEY     | order_id     | null                         |
| order_items     | order_items_product_id_fkey       | FOREIGN KEY     | product_id   | null                         |
| order_items     | order_items_pkey                  | PRIMARY KEY     | id           | null                         |
| orders          | 2200_17319_10_not_null            | CHECK           | null         | total IS NOT NULL            |
| orders          | 2200_17319_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| orders          | 2200_17319_2_not_null             | CHECK           | null         | order_number IS NOT NULL     |
| orders          | 2200_17319_7_not_null             | CHECK           | null         | subtotal IS NOT NULL         |
| orders          | orders_address_id_fkey            | FOREIGN KEY     | address_id   | null                         |
| orders          | orders_user_id_fkey               | FOREIGN KEY     | user_id      | null                         |
| orders          | orders_pkey                       | PRIMARY KEY     | id           | null                         |
| orders          | orders_order_number_key           | UNIQUE          | order_number | null                         |
| payment_intents | 2200_17374_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| payment_intents | 2200_17374_5_not_null             | CHECK           | null         | amount IS NOT NULL           |
| payment_intents | payment_intents_order_id_fkey     | FOREIGN KEY     | order_id     | null                         |
| payment_intents | payment_intents_pkey              | PRIMARY KEY     | id           | null                         |
| products        | 2200_17248_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| products        | 2200_17248_2_not_null             | CHECK           | null         | sku IS NOT NULL              |
| products        | 2200_17248_3_not_null             | CHECK           | null         | name IS NOT NULL             |
| products        | 2200_17248_4_not_null             | CHECK           | null         | slug IS NOT NULL             |
| products        | 2200_17248_6_not_null             | CHECK           | null         | price IS NOT NULL            |
| products        | products_price_check              | CHECK           | null         | (price >= (0)::numeric)      |
| products        | products_sale_price_check         | CHECK           | null         | (sale_price >= (0)::numeric) |
| products        | products_stock_quantity_check     | CHECK           | null         | (stock_quantity >= 0)        |
| products        | products_category_id_fkey         | FOREIGN KEY     | category_id  | null                         |
| products        | products_pkey                     | PRIMARY KEY     | id           | null                         |
| products        | products_sku_key                  | UNIQUE          | sku          | null                         |
| products        | products_slug_key                 | UNIQUE          | slug         | null                         |
| profiles        | 2200_17209_1_not_null             | CHECK           | null         | id IS NOT NULL               |
| profiles        | 2200_17209_2_not_null             | CHECK           | null         | email IS NOT NULL            |
| profiles        | profiles_id_fkey                  | FOREIGN KEY     | id           | null                         |
| profiles        | profiles_pkey                     | PRIMARY KEY     | id           | null                         |
| profiles        | profiles_cpf_key                  | UNIQUE          | cpf          | null                         |
| profiles        | profiles_email_key                | UNIQUE          | email        | null                         |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_3_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "cep IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_4_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "street IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_5_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "number IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_7_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "neighborhood IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_8_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "city IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "2200_17303_9_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "state IS NOT NULL"
  },
  {
    "table_name": "addresses",
    "constraint_name": "addresses_user_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "check_clause": null
  },
  {
    "table_name": "addresses",
    "constraint_name": "addresses_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "cart_items",
    "constraint_name": "2200_17281_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "cart_items",
    "constraint_name": "2200_17281_4_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "quantity IS NOT NULL"
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_quantity_check",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "(quantity > 0)"
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_product_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "product_id",
    "check_clause": null
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_user_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "check_clause": null
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_user_id_product_id_key",
    "constraint_type": "UNIQUE",
    "column_name": "product_id",
    "check_clause": null
  },
  {
    "table_name": "cart_items",
    "constraint_name": "cart_items_user_id_product_id_key",
    "constraint_type": "UNIQUE",
    "column_name": "user_id",
    "check_clause": null
  },
  {
    "table_name": "categories",
    "constraint_name": "2200_17232_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "categories",
    "constraint_name": "2200_17232_2_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "name IS NOT NULL"
  },
  {
    "table_name": "categories",
    "constraint_name": "2200_17232_3_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "slug IS NOT NULL"
  },
  {
    "table_name": "categories",
    "constraint_name": "categories_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "categories",
    "constraint_name": "categories_name_key",
    "constraint_type": "UNIQUE",
    "column_name": "name",
    "check_clause": null
  },
  {
    "table_name": "categories",
    "constraint_name": "categories_slug_key",
    "constraint_type": "UNIQUE",
    "column_name": "slug",
    "check_clause": null
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_4_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "product_name IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_5_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "product_sku IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_6_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "quantity IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_7_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "unit_price IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "2200_17351_8_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "total_price IS NOT NULL"
  },
  {
    "table_name": "order_items",
    "constraint_name": "order_items_quantity_check",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "(quantity > 0)"
  },
  {
    "table_name": "order_items",
    "constraint_name": "order_items_order_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "order_id",
    "check_clause": null
  },
  {
    "table_name": "order_items",
    "constraint_name": "order_items_product_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "product_id",
    "check_clause": null
  },
  {
    "table_name": "order_items",
    "constraint_name": "order_items_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "orders",
    "constraint_name": "2200_17319_10_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "total IS NOT NULL"
  },
  {
    "table_name": "orders",
    "constraint_name": "2200_17319_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "orders",
    "constraint_name": "2200_17319_2_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "order_number IS NOT NULL"
  },
  {
    "table_name": "orders",
    "constraint_name": "2200_17319_7_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "subtotal IS NOT NULL"
  },
  {
    "table_name": "orders",
    "constraint_name": "orders_address_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "address_id",
    "check_clause": null
  },
  {
    "table_name": "orders",
    "constraint_name": "orders_user_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "user_id",
    "check_clause": null
  },
  {
    "table_name": "orders",
    "constraint_name": "orders_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "orders",
    "constraint_name": "orders_order_number_key",
    "constraint_type": "UNIQUE",
    "column_name": "order_number",
    "check_clause": null
  },
  {
    "table_name": "payment_intents",
    "constraint_name": "2200_17374_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "payment_intents",
    "constraint_name": "2200_17374_5_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "amount IS NOT NULL"
  },
  {
    "table_name": "payment_intents",
    "constraint_name": "payment_intents_order_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "order_id",
    "check_clause": null
  },
  {
    "table_name": "payment_intents",
    "constraint_name": "payment_intents_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "products",
    "constraint_name": "2200_17248_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "products",
    "constraint_name": "2200_17248_2_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "sku IS NOT NULL"
  },
  {
    "table_name": "products",
    "constraint_name": "2200_17248_3_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "name IS NOT NULL"
  },
  {
    "table_name": "products",
    "constraint_name": "2200_17248_4_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "slug IS NOT NULL"
  },
  {
    "table_name": "products",
    "constraint_name": "2200_17248_6_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "price IS NOT NULL"
  },
  {
    "table_name": "products",
    "constraint_name": "products_price_check",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "(price >= (0)::numeric)"
  },
  {
    "table_name": "products",
    "constraint_name": "products_sale_price_check",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "(sale_price >= (0)::numeric)"
  },
  {
    "table_name": "products",
    "constraint_name": "products_stock_quantity_check",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "(stock_quantity >= 0)"
  },
  {
    "table_name": "products",
    "constraint_name": "products_category_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "category_id",
    "check_clause": null
  },
  {
    "table_name": "products",
    "constraint_name": "products_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "products",
    "constraint_name": "products_sku_key",
    "constraint_type": "UNIQUE",
    "column_name": "sku",
    "check_clause": null
  },
  {
    "table_name": "products",
    "constraint_name": "products_slug_key",
    "constraint_type": "UNIQUE",
    "column_name": "slug",
    "check_clause": null
  },
  {
    "table_name": "profiles",
    "constraint_name": "2200_17209_1_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "id IS NOT NULL"
  },
  {
    "table_name": "profiles",
    "constraint_name": "2200_17209_2_not_null",
    "constraint_type": "CHECK",
    "column_name": null,
    "check_clause": "email IS NOT NULL"
  },
  {
    "table_name": "profiles",
    "constraint_name": "profiles_id_fkey",
    "constraint_type": "FOREIGN KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "profiles",
    "constraint_name": "profiles_pkey",
    "constraint_type": "PRIMARY KEY",
    "column_name": "id",
    "check_clause": null
  },
  {
    "table_name": "profiles",
    "constraint_name": "profiles_cpf_key",
    "constraint_type": "UNIQUE",
    "column_name": "cpf",
    "check_clause": null
  },
  {
    "table_name": "profiles",
    "constraint_name": "profiles_email_key",
    "constraint_type": "UNIQUE",
    "column_name": "email",
    "check_clause": null
  }
]
</estrutura-em-json>