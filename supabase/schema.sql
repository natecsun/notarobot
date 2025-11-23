-- 1. Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text unique,
  avatar_url text,
  is_pro boolean default false,
  credits integer default 0,
  api_usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 3. Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, credits)
  values (new.id, new.email, split_part(new.email, '@', 1), 50);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Leaderboard Table
create table leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  username text not null,
  score integer not null,
  accuracy numeric,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table leaderboard enable row level security;

create policy "Leaderboard is viewable by everyone" on leaderboard
  for select using (true);

create policy "Users can insert their own scores" on leaderboard
  for insert with check (auth.uid() = user_id);

-- 5. Subscription and Payment Tables
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_type text not null check (plan_type in ('pro', 'enterprise')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subscriptions enable row level security;

create policy "Users can view own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions" on subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions" on subscriptions
  for update using (auth.uid() = user_id);

create table credit_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_payment_intent_id text,
  credits_purchased integer not null,
  amount_paid numeric not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table credit_purchases enable row level security;

create policy "Users can view own purchases" on credit_purchases
  for select using (auth.uid() = user_id);

create policy "Users can insert own purchases" on credit_purchases
  for insert with check (auth.uid() = user_id);

-- 6. Saved Results Table
create table saved_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_type text not null check (service_type in ('resume', 'profile', 'essay')),
  original_content text,
  analyzed_content jsonb,
  result_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table saved_results enable row level security;

create policy "Users can manage own saved results" on saved_results
  for all using (auth.uid() = user_id);

-- 7. RPC Functions for Credits
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

-- 8. Update existing profiles table with subscription tracking
alter table profiles add column stripe_customer_id text;
alter table profiles add column subscription_status text check (subscription_status in ('active', 'canceled', 'none'));
alter table profiles add column plan_type text check (plan_type in ('free', 'pro', 'enterprise'));

-- 9. Public Sharing of Results
alter table saved_results add column is_public boolean default false;

create policy "Public can view shared results" on saved_results
  for select using (is_public = true);
