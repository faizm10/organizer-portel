-- Automatically create a profile row whenever a new auth.users row is created.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create an empty profile for the new user. full_name can be updated later.
  insert into public.profiles (id, full_name)
  values (new.id, null)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


