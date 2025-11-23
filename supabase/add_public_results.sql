-- Add is_public column to saved_results
alter table saved_results add column is_public boolean default false;

-- Allow public read access to saved_results where is_public is true
create policy "Public can view shared results" on saved_results
  for select using (is_public = true);
