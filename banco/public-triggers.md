# todos os triggers e suas tabelas

<estrutura-em-markdown>
| trigger_schema | trigger_name                  | event_manipulation | event_object_schema | table_name | action_statement                         | action_orientation | action_timing |
| -------------- | ----------------------------- | ------------------ | ------------------- | ---------- | ---------------------------------------- | ------------------ | ------------- |
| public         | update_cart_items_updated_at  | UPDATE             | public              | cart_items | EXECUTE FUNCTION update_updated_at()     | ROW                | BEFORE        |
| public         | generate_order_number_trigger | INSERT             | public              | orders     | EXECUTE FUNCTION generate_order_number() | ROW                | BEFORE        |
| public         | update_orders_updated_at      | UPDATE             | public              | orders     | EXECUTE FUNCTION update_updated_at()     | ROW                | BEFORE        |
| public         | update_products_updated_at    | UPDATE             | public              | products   | EXECUTE FUNCTION update_updated_at()     | ROW                | BEFORE        |
| public         | update_profiles_updated_at    | UPDATE             | public              | profiles   | EXECUTE FUNCTION update_updated_at()     | ROW                | BEFORE        |

| trigger_name                  | table_name | function_name         | timing | event  | orientation  | is_enabled |
| ----------------------------- | ---------- | --------------------- | ------ | ------ | ------------ | ---------- |
| update_cart_items_updated_at  | cart_items | update_updated_at     | BEFORE | UPDATE | FOR EACH ROW | O          |
| generate_order_number_trigger | orders     | generate_order_number | BEFORE | INSERT | FOR EACH ROW | O          |
| update_orders_updated_at      | orders     | update_updated_at     | BEFORE | UPDATE | FOR EACH ROW | O          |
| update_products_updated_at    | products   | update_updated_at     | BEFORE | UPDATE | FOR EACH ROW | O          |
| update_profiles_updated_at    | profiles   | update_updated_at     | BEFORE | UPDATE | FOR EACH ROW | O          |

</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "trigger_schema": "public",
    "trigger_name": "update_cart_items_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_schema": "public",
    "table_name": "cart_items",
    "action_statement": "EXECUTE FUNCTION update_updated_at()",
    "action_orientation": "ROW",
    "action_timing": "BEFORE"
  },
  {
    "trigger_schema": "public",
    "trigger_name": "generate_order_number_trigger",
    "event_manipulation": "INSERT",
    "event_object_schema": "public",
    "table_name": "orders",
    "action_statement": "EXECUTE FUNCTION generate_order_number()",
    "action_orientation": "ROW",
    "action_timing": "BEFORE"
  },
  {
    "trigger_schema": "public",
    "trigger_name": "update_orders_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_schema": "public",
    "table_name": "orders",
    "action_statement": "EXECUTE FUNCTION update_updated_at()",
    "action_orientation": "ROW",
    "action_timing": "BEFORE"
  },
  {
    "trigger_schema": "public",
    "trigger_name": "update_products_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_schema": "public",
    "table_name": "products",
    "action_statement": "EXECUTE FUNCTION update_updated_at()",
    "action_orientation": "ROW",
    "action_timing": "BEFORE"
  },
  {
    "trigger_schema": "public",
    "trigger_name": "update_profiles_updated_at",
    "event_manipulation": "UPDATE",
    "event_object_schema": "public",
    "table_name": "profiles",
    "action_statement": "EXECUTE FUNCTION update_updated_at()",
    "action_orientation": "ROW",
    "action_timing": "BEFORE"
  }
]

[
  {
    "trigger_name": "update_cart_items_updated_at",
    "table_name": "cart_items",
    "function_name": "update_updated_at",
    "timing": "BEFORE",
    "event": "UPDATE",
    "orientation": "FOR EACH ROW",
    "is_enabled": "O"
  },
  {
    "trigger_name": "generate_order_number_trigger",
    "table_name": "orders",
    "function_name": "generate_order_number",
    "timing": "BEFORE",
    "event": "INSERT",
    "orientation": "FOR EACH ROW",
    "is_enabled": "O"
  },
  {
    "trigger_name": "update_orders_updated_at",
    "table_name": "orders",
    "function_name": "update_updated_at",
    "timing": "BEFORE",
    "event": "UPDATE",
    "orientation": "FOR EACH ROW",
    "is_enabled": "O"
  },
  {
    "trigger_name": "update_products_updated_at",
    "table_name": "products",
    "function_name": "update_updated_at",
    "timing": "BEFORE",
    "event": "UPDATE",
    "orientation": "FOR EACH ROW",
    "is_enabled": "O"
  },
  {
    "trigger_name": "update_profiles_updated_at",
    "table_name": "profiles",
    "function_name": "update_updated_at",
    "timing": "BEFORE",
    "event": "UPDATE",
    "orientation": "FOR EACH ROW",
    "is_enabled": "O"
  }
]
</estrutura-em-json>