-- ==============================================================================
-- WITHINARTS FINE ART STUDIO - SUPABASE ORDERS TABLE SCHEMA
-- Copy this SQL and run it in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ynlkabxzlbdjhhygcddd/sql
-- ==============================================================================

-- 1. Create Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text,
  customer_name text not null,
  customer_phone text not null,
  customer_city text,
  customer_address text,
  custom_name_text text,
  items jsonb default '[]'::jsonb,
  total_pkr numeric default 0,
  total_usd numeric default 0,
  order_type text default 'website', -- 'website', 'whatsapp', or 'custom'
  status text default 'Pending',     -- 'Pending', 'In Progress', 'Completed', 'Dispatched', 'Cancelled'
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Create Policies for inserting, reading, updating & deleting
drop policy if exists "Allow public insert to orders" on public.orders;
create policy "Allow public insert to orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Allow read orders" on public.orders;
create policy "Allow read orders"
  on public.orders for select
  using (true);

drop policy if exists "Allow update orders" on public.orders;
create policy "Allow update orders"
  on public.orders for update
  using (true);

drop policy if exists "Allow delete orders" on public.orders;
create policy "Allow delete orders"
  on public.orders for delete
  using (true);
