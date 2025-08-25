# todas as foreign keys com detalhes

<estrutura-em-markdown>
| table_schema | table_name      | column_name | foreign_table_schema | foreign_table_name | foreign_column_name | constraint_name               | update_rule | delete_rule |
| ------------ | --------------- | ----------- | -------------------- | ------------------ | ------------------- | ----------------------------- | ----------- | ----------- |
| public       | cart_items      | product_id  | public               | products           | id                  | cart_items_product_id_fkey    | NO ACTION   | CASCADE     |
| public       | order_items     | order_id    | public               | orders             | id                  | order_items_order_id_fkey     | NO ACTION   | CASCADE     |
| public       | order_items     | product_id  | public               | products           | id                  | order_items_product_id_fkey   | NO ACTION   | NO ACTION   |
| public       | orders          | address_id  | public               | addresses          | id                  | orders_address_id_fkey        | NO ACTION   | NO ACTION   |
| public       | payment_intents | order_id    | public               | orders             | id                  | payment_intents_order_id_fkey | NO ACTION   | CASCADE     |
| public       | products        | category_id | public               | categories         | id                  | products_category_id_fkey     | NO ACTION   | NO ACTION   |
| public       | addresses       | user_id     | auth                 | users              | id                  | addresses_user_id_fkey        | NO ACTION   | CASCADE     |
| public       | cart_items      | user_id     | auth                 | users              | id                  | cart_items_user_id_fkey       | NO ACTION   | CASCADE     |
| public       | orders          | user_id     | auth                 | users              | id                  | orders_user_id_fkey           | NO ACTION   | NO ACTION   |
| public       | profiles        | id          | auth                 | users              | id                  | profiles_id_fkey              | NO ACTION   | CASCADE     |
| public       | price_history   | product_id  | public               | products           | id                  | price_history_product_id_fkey | NO ACTION   | CASCADE     |
| public       | price_history   | changed_by  | auth                 | users              | id                  | price_history_changed_by_fkey | NO ACTION   | NO ACTION   |
| public       | product_variants| product_id  | public               | products           | id                  | product_variants_product_id_fkey | NO ACTION | CASCADE     |
| public       | related_products| product_id  | public               | products           | id                  | related_products_product_id_fkey | NO ACTION | CASCADE     |
| public       | related_products| related_product_id | public           | products           | id                  | related_products_related_product_id_fkey | NO ACTION | CASCADE |
| public       | related_products| created_by  | auth                 | users              | id                  | related_products_created_by_fkey | NO ACTION | NO ACTION   |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "table_schema": "public",
    "table_name": "cart_items",
    "column_name": "product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "cart_items_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "order_items",
    "column_name": "order_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "orders",
    "foreign_column_name": "id",
    "constraint_name": "order_items_order_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "order_items",
    "column_name": "product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "order_items_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  },
  {
    "table_schema": "public",
    "table_name": "orders",
    "column_name": "address_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "addresses",
    "foreign_column_name": "id",
    "constraint_name": "orders_address_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  },
  {
    "table_schema": "public",
    "table_name": "payment_intents",
    "column_name": "order_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "orders",
    "foreign_column_name": "id",
    "constraint_name": "payment_intents_order_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "products",
    "column_name": "category_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "categories",
    "foreign_column_name": "id",
    "constraint_name": "products_category_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  },
  {
    "table_schema": "public",
    "table_name": "addresses",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "addresses_user_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "cart_items",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "cart_items_user_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "orders",
    "column_name": "user_id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "orders_user_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "id",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "profiles_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "price_history",
    "column_name": "product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "price_history_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "price_history",
    "column_name": "changed_by",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "price_history_changed_by_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  },
  {
    "table_schema": "public",
    "table_name": "product_variants",
    "column_name": "product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "product_variants_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "related_products",
    "column_name": "product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "related_products_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "related_products",
    "column_name": "related_product_id",
    "foreign_table_schema": "public",
    "foreign_table_name": "products",
    "foreign_column_name": "id",
    "constraint_name": "related_products_related_product_id_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "CASCADE"
  },
  {
    "table_schema": "public",
    "table_name": "related_products",
    "column_name": "created_by",
    "foreign_table_schema": "auth",
    "foreign_table_name": "users",
    "foreign_column_name": "id",
    "constraint_name": "related_products_created_by_fkey",
    "update_rule": "NO ACTION",
    "delete_rule": "NO ACTION"
  }
]
</estrutura-em-json>