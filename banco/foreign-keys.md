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
  }
]
</estrutura-em-json>