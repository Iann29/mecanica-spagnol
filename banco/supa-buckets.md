# Listar todos os buckets

<estrutura-em-markdown>
| id       | name     | owner | public | avif_autodetection | file_size_limit | allowed_mime_types | created_at                    | updated_at                    |
| -------- | -------- | ----- | ------ | ------------------ | --------------- | ------------------ | ----------------------------- | ----------------------------- |
| products | products | null  | true   | false              | null            | null               | 2025-07-17 12:40:28.901936+00 | 2025-07-17 12:40:28.901936+00 |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "id": "products",
    "name": "products",
    "owner": null,
    "public": true,
    "avif_autodetection": false,
    "file_size_limit": null,
    "allowed_mime_types": null,
    "created_at": "2025-07-17 12:40:28.901936+00",
    "updated_at": "2025-07-17 12:40:28.901936+00"
  }
]
</estrutura-em-json>

| bucket_name | visibility | max_file_size | allowed_types     | created_date |
| ----------- | ---------- | ------------- | ----------------- | ------------ |
| products    | 🌍 Public  | No limit      | All types allowed | 2025-07-17   |



<estrutura-em-markdown>
| schemaname | tablename | policyname                    | permissive | roles    | action | using_expression                                                                                                                                         | with_check_expression                                                                                                                                    |
| ---------- | --------- | ----------------------------- | ---------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storage    | objects   | Admins podem atualizar        | PERMISSIVE | {public} | UPDATE | ((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))) | null                                                                                                                                                     |
| storage    | objects   | Admins podem deletar          | PERMISSIVE | {public} | DELETE | ((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))) | null                                                                                                                                                     |
| storage    | objects   | Admins podem fazer upload     | PERMISSIVE | {public} | INSERT | null                                                                                                                                                     | ((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))))) |
| storage    | objects   | Imagens públicas para leitura | PERMISSIVE | {public} | SELECT | (bucket_id = 'products'::text)                                                                                                                           | null                                                                                                                                                     |
</estrutura-em-markdown>

<estrutura-em-json>
[
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Admins podem atualizar",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "action": "UPDATE",
    "using_expression": "((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))))",
    "with_check_expression": null
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Admins podem deletar",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "action": "DELETE",
    "using_expression": "((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))))",
    "with_check_expression": null
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Admins podem fazer upload",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "action": "INSERT",
    "using_expression": null,
    "with_check_expression": "((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))))"
  },
  {
    "schemaname": "storage",
    "tablename": "objects",
    "policyname": "Imagens públicas para leitura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "action": "SELECT",
    "using_expression": "(bucket_id = 'products'::text)",
    "with_check_expression": null
  }
]
</estrutura-em-json>
