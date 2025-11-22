-- Update the handle_new_user function to give 50 credits by default
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, credits)
  values (new.id, new.email, split_part(new.email, '@', 1), 50);
  return new;
end;
$$ language plpgsql security definer;
