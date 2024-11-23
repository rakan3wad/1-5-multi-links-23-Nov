-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  username_val text;
begin
  -- Get username from metadata or generate from email
  username_val := coalesce(
    new.raw_user_meta_data->>'username',
    regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g')
  );
  
  -- Ensure username is unique by appending numbers if needed
  while exists (select 1 from public.profiles where username = username_val) loop
    username_val := username_val || floor(random() * 1000)::text;
  end loop;

  -- Create profile
  insert into public.profiles (id, username, email, display_name)
  values (
    new.id,
    username_val,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any missing profiles with unique usernames
do $$
declare
  u record;
  username_val text;
begin
  for u in 
    select 
      users.id,
      users.email,
      users.raw_user_meta_data->>'username' as meta_username
    from auth.users
    left join public.profiles on users.id = profiles.id
    where profiles.id is null
  loop
    -- Get username from metadata or generate from email
    username_val := coalesce(
      u.meta_username,
      regexp_replace(split_part(u.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g')
    );
    
    -- Ensure username is unique
    while exists (select 1 from public.profiles where username = username_val) loop
      username_val := username_val || floor(random() * 1000)::text;
    end loop;
    
    -- Create profile
    insert into public.profiles (id, username, email, display_name)
    values (
      u.id,
      username_val,
      u.email,
      coalesce(u.meta_username, split_part(u.email, '@', 1))
    );
  end loop;
end;
$$;
