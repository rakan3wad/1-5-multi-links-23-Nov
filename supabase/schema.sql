-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique not null,
  display_name text,
  email text not null,
  avatar_url text,
  background_color text default '#79afd9',
  bio text,
  constraint username_format check (username ~* '^[a-z0-9_]+$')
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create security policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, email)
  values (
    new.id,
    lower(new.raw_user_meta_data->>'username'),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username'),
    lower(new.email)
  );
  return new;
end;
$$;

-- Create a trigger to automatically create a profile for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Set up storage
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Set up storage policies
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner );

-- Create a function to check if a username exists
create or replace function public.username_exists(username text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.profiles
    where profiles.username = lower(username)
  );
end;
$$;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.username_exists to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';
