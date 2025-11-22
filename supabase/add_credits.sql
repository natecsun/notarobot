-- Run this in your Supabase SQL Editor to update your database

-- 1. Add credits column (safe to run even if it exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits integer DEFAULT 0;

-- 2. Create/Update RPC functions
create or replace function add_credits(user_id uuid, amount int)
returns void as $$
begin
  update public.profiles
  set credits = credits + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

create or replace function deduct_credits(user_id uuid, amount int)
returns void as $$
begin
  update public.profiles
  set credits = credits - amount
  where id = user_id;
end;
$$ language plpgsql security definer;
