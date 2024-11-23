-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create new policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "System can create profiles for new users"
  on profiles for insert
  with check ( true );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Grant necessary permissions to the postgres role
grant usage on schema public to postgres;
grant all privileges on all tables in schema public to postgres;
grant all privileges on all sequences in schema public to postgres;
grant all privileges on all functions in schema public to postgres;
