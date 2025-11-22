-- 1. Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text unique,
  avatar_url text,
  is_pro boolean default false,
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
  insert into public.profiles (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1));
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table leaderboard enable row level security;

create policy "Leaderboard is viewable by everyone" on leaderboard
  for select using (true);

create policy "Users can insert their own scores" on leaderboard
  for insert with check (auth.uid() = user_id);
