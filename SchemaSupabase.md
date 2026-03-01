## 1. Schema Core: `public.companies`
- **Tabela:** `companies` (Multi-tenant isolado)
- **Colunas Principais:** `id` (uuid PK), `name` (text), `plan` (text), `active` (bool), `slug` (text), `created_at` (timestamptz), `asaas_customer_id` (text). *(Nota: A tabela NÃO possui a coluna `owner_id`)*.
- **Segurança (RLS Ativado):**
  - **Policy 1 (Super Admin):** `ALL` se `is_super_admin() = true`. (Bypass total).
  - **Policy 2 (Inquilino/Tenant):** `SELECT` se `id = get_my_company_id()`. (Isolamento de leitura).
- **Regra de Arquitetura (Onboarding):** Como a RLS bloqueia `INSERT` para usuários comuns no frontend, a criação de novas empresas durante o Onboarding de clientes (Landing Page) **NÃO PODE** ser feita pelo React. Ela deve ser delegada para uma Edge Function (que utiliza a `SUPABASE_SERVICE_ROLE_KEY` para contornar a RLS) ou automatizada via Database Triggers.

