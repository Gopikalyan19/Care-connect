alter table profiles enable row level security;
alter table support_requests enable row level security;
alter table appointments enable row level security;
alter table session_notes enable row level security;
alter table selfcare_plans enable row level security;
alter table resources enable row level security;
alter table feedback enable row level security;

-- Note: Backend uses SERVICE_ROLE_KEY and enforces RBAC through middleware.
-- Add stricter client-side policies only if you expose Supabase directly in frontend.
