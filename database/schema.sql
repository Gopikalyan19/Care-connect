-- NAU Care Connect - Functional Supabase Schema
-- Paste this in Supabase SQL Editor and run once.
-- For a fresh setup, this script safely recreates the app tables.

create extension if not exists "pgcrypto";

drop table if exists feedback cascade;
drop table if exists resources cascade;
drop table if exists selfcare_plans cascade;
drop table if exists session_notes cascade;
drop table if exists appointments cascade;
drop table if exists support_requests cascade;
drop table if exists profiles cascade;

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  role text not null check (role in ('student','faculty','member','peer','selfcare','psychologist','psychiatrist','admin')),
  college text,
  department text,
  status text default 'active' check (status in ('active','inactive','blocked')),
  created_at timestamptz default now()
);

create table support_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text unique not null,
  user_id uuid not null references profiles(id) on delete cascade,
  category text not null check (category in ('peer','selfcare','psychologist','psychiatrist')),
  concern_type text not null default 'general',
  description text not null,
  preferred_date date not null,
  preferred_time time not null,
  mode text default 'online' check (mode in ('online','offline')),
  urgency_level text default 'low' check (urgency_level in ('low','medium','high')),
  status text default 'submitted' check (status in ('submitted','assigned','scheduled','completed','closed','cancelled')),
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references support_requests(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  meeting_link text,
  location text,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at timestamptz default now()
);

create table session_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references support_requests(id) on delete cascade,
  added_by uuid references profiles(id) on delete set null,
  note_type text not null check (note_type in ('peer','selfcare','doctor','admin')),
  summary text not null,
  risk_level text default 'low' check (risk_level in ('low','medium','high')),
  follow_up_required boolean default false,
  follow_up_date date,
  created_at timestamptz default now()
);

create table selfcare_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  assigned_by uuid references profiles(id) on delete set null,
  plan_title text not null,
  plan_duration text not null default '7 days',
  daily_activity text not null,
  goal text not null,
  status text default 'active' check (status in ('active','completed','cancelled')),
  created_at timestamptz default now()
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  resource_type text not null default 'article' check (resource_type in ('article','pdf','video','audio','worksheet')),
  file_url text,
  description text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references support_requests(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  feedback_text text,
  created_at timestamptz default now()
);

create index idx_profiles_auth_user_id on profiles(auth_user_id);
create index idx_profiles_email on profiles(email);
create index idx_profiles_role on profiles(role);
create index idx_support_requests_user_id on support_requests(user_id);
create index idx_support_requests_assigned_to on support_requests(assigned_to);
create index idx_support_requests_category on support_requests(category);
create index idx_support_requests_status on support_requests(status);
create index idx_support_requests_date on support_requests(preferred_date);
create index idx_appointments_user_id on appointments(user_id);
create index idx_appointments_assigned_to on appointments(assigned_to);
create index idx_appointments_date on appointments(appointment_date);
create index idx_session_notes_request_id on session_notes(request_id);
create index idx_selfcare_plans_user_id on selfcare_plans(user_id);
create index idx_feedback_request_id on feedback(request_id);

alter table profiles enable row level security;
alter table support_requests enable row level security;
alter table appointments enable row level security;
alter table session_notes enable row level security;
alter table selfcare_plans enable row level security;
alter table resources enable row level security;
alter table feedback enable row level security;

-- Development policies. Backend uses service_role, so these mainly help if you test from Supabase client directly.
create policy "profiles_dev_all" on profiles for all using (true) with check (true);
create policy "support_requests_dev_all" on support_requests for all using (true) with check (true);
create policy "appointments_dev_all" on appointments for all using (true) with check (true);
create policy "session_notes_dev_all" on session_notes for all using (true) with check (true);
create policy "selfcare_plans_dev_all" on selfcare_plans for all using (true) with check (true);
create policy "resources_dev_all" on resources for all using (true) with check (true);
create policy "feedback_dev_all" on feedback for all using (true) with check (true);
