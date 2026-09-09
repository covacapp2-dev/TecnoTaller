create table if not exists public.cash_register (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  opening_amount numeric(12,2) default 0,
  closing_amount numeric(12,2) default 0,
  status text default 'abierta' check (status in ('abierta', 'cerrada')),
  opened_at timestamptz default now(),
  closed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.cash_register enable row level security;

create policy "Users manage own cash_register" on public.cash_register
  for all using (auth.uid() = user_id);