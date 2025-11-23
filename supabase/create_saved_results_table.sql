-- Create saved_results table if it doesn't exist
create table if not exists saved_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_type text not null check (service_type in ('resume', 'profile', 'essay')),
  original_content text,
  analyzed_content jsonb,
  result_data jsonb not null,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table saved_results enable row level security;

-- Policy: Users can manage their own results
create policy "Users can manage own saved results" on saved_results
  for all using (auth.uid() = user_id);

-- Policy: Public can view shared results
create policy "Public can view shared results" on saved_results
  for select using (is_public = true);
