-- Drop the existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Update RLS policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Recreate policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Service role can create profiles"
  on profiles for insert
  using ( auth.service_role() );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Grant necessary permissions
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
