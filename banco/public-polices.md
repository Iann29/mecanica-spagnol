## Todas as policies do schema public

<estrutura-em-markdown>
| schemaname | tablename       | policyname                                     | permissive | roles    | cmd    | qual                                                                                                                   | with_check                                                                                                         |
| ---------- | --------------- | ---------------------------------------------- | ---------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| public     | addresses       | Usuários podem gerenciar próprios endereços    | PERMISSIVE | {public} | ALL    | (auth.uid() = user_id)                                                                                                 | null                                                                                                               |
| public     | cart_items      | Usuários podem gerenciar próprio carrinho      | PERMISSIVE | {public} | ALL    | (auth.uid() = user_id)                                                                                                 | null                                                                                                               |
| public     | categories      | Apenas admins podem modificar categorias       | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | categories      | Categorias são públicas para leitura           | PERMISSIVE | {public} | SELECT | (is_active = true)                                                                                                     | null                                                                                                               |
| public     | order_items     | Admins podem ver todos os itens                | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | order_items     | Usuários podem criar itens de próprios pedidos | PERMISSIVE | {public} | INSERT | null                                                                                                                   | (EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid())))) |
| public     | order_items     | Usuários podem ver itens de próprios pedidos   | PERMISSIVE | {public} | SELECT | (EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))))     | null                                                                                                               |
| public     | orders          | Admins podem gerenciar todos os pedidos        | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | orders          | Usuários podem criar próprios pedidos          | PERMISSIVE | {public} | INSERT | null                                                                                                                   | (auth.uid() = user_id)                                                                                             |
| public     | orders          | Usuários podem ver próprios pedidos            | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id)                                                                                                 | null                                                                                                               |
| public     | payment_intents | Admins podem ver todos os pagamentos           | PERMISSIVE | {public} | SELECT | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | payment_intents | Apenas sistema pode criar pagamentos           | PERMISSIVE | {public} | INSERT | null                                                                                                                   | false                                                                                                              |
| public     | payment_intents | Usuários podem ver próprios pagamentos         | PERMISSIVE | {public} | SELECT | (EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = payment_intents.order_id) AND (orders.user_id = auth.uid())))) | null                                                                                                               |
| public     | products        | Apenas admins podem gerenciar produtos         | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | products        | Produtos ativos são públicos                   | PERMISSIVE | {public} | SELECT | (is_active = true)                                                                                                     | null                                                                                                               |
| public     | profiles        | Admins podem ver todos os perfis               | PERMISSIVE | {public} | SELECT | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | profiles        | Usuários podem atualizar próprio perfil        | PERMISSIVE | {public} | UPDATE | (auth.uid() = id)                                                                                                      | null                                                                                                               |
| public     | profiles        | Usuários podem ver próprio perfil              | PERMISSIVE | {public} | SELECT | (auth.uid() = id)                                                                                                      | null                                                                                                               |
| public     | price_history   | Admins podem ver histórico de preços           | PERMISSIVE | {public} | SELECT | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | product_variants| Admins podem gerenciar variações                | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | product_variants| Variações de produtos ativos são públicas      | PERMISSIVE | {public} | SELECT | (is_active = true) AND (EXISTS ( SELECT 1 FROM products WHERE ((products.id = product_variants.product_id) AND (products.is_active = true)))) | null                                                                                         |
| public     | related_products| Admins podem gerenciar produtos relacionados   | PERMISSIVE | {public} | ALL    | is_admin_user()                                                                                                        | null                                                                                                               |
| public     | related_products| Relacionamentos de produtos ativos são públicos| PERMISSIVE | {public} | SELECT | (EXISTS ( SELECT 1 FROM products p1 WHERE ((p1.id = related_products.product_id) AND (p1.is_active = true)))) AND (EXISTS ( SELECT 1 FROM products p2 WHERE ((p2.id = related_products.related_product_id) AND (p2.is_active = true)))) | null |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "schemaname": "public",
    "tablename": "addresses",
    "policyname": "Usuários podem gerenciar próprios endereços",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "cart_items",
    "policyname": "Usuários podem gerenciar próprio carrinho",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categories",
    "policyname": "Apenas admins podem modificar categorias",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categories",
    "policyname": "Categorias são públicas para leitura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "order_items",
    "policyname": "Admins podem ver todos os itens",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "order_items",
    "policyname": "Usuários podem criar itens de próprios pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM orders\n  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))))"
  },
  {
    "schemaname": "public",
    "tablename": "order_items",
    "policyname": "Usuários podem ver itens de próprios pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM orders\n  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "policyname": "Admins podem gerenciar todos os pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "policyname": "Usuários podem criar próprios pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "orders",
    "policyname": "Usuários podem ver próprios pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "payment_intents",
    "policyname": "Admins podem ver todos os pagamentos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "payment_intents",
    "policyname": "Apenas sistema pode criar pagamentos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "false"
  },
  {
    "schemaname": "public",
    "tablename": "payment_intents",
    "policyname": "Usuários podem ver próprios pagamentos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM orders\n  WHERE ((orders.id = payment_intents.order_id) AND (orders.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "policyname": "Apenas admins podem gerenciar produtos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "products",
    "policyname": "Produtos ativos são públicos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(is_active = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Admins podem ver todos os perfis",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Usuários podem atualizar próprio perfil",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Usuários podem ver próprio perfil",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "price_history",
    "policyname": "Admins podem ver histórico de preços",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "product_variants",
    "policyname": "Admins podem gerenciar variações",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "product_variants",
    "policyname": "Variações de produtos ativos são públicas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(is_active = true) AND (EXISTS ( SELECT 1 FROM products WHERE ((products.id = product_variants.product_id) AND (products.is_active = true))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "related_products",
    "policyname": "Admins podem gerenciar produtos relacionados",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "is_admin_user()",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "related_products",
    "policyname": "Relacionamentos de produtos ativos são públicos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1 FROM products p1 WHERE ((p1.id = related_products.product_id) AND (p1.is_active = true)))) AND (EXISTS ( SELECT 1 FROM products p2 WHERE ((p2.id = related_products.related_product_id) AND (p2.is_active = true))))",
    "with_check": null
  }
]
</estrutura-em-json>