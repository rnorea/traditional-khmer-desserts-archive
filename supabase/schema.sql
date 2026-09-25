-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  username text unique not null,
  full_name text,
  organization text,
  role text default 'user' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username, full_name, organization, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'organization',
    'user'
  );
  return new;
end;
$$;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create entries table
create table public.entries (
  id uuid default gen_random_uuid() primary key,
  title_en text not null,
  title_kh text not null,
  description_en text not null,
  description_kh text not null,
  ingredients_en text not null,
  ingredients_kh text not null,
  instructions_en text not null,
  instructions_kh text not null,
  image_url text,
  status text default 'published' not null,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security for entries
alter table public.entries enable row level security;
create policy "Everyone can view published entries." on public.entries for select using (status = 'published');
create policy "Users can view their own entries regardless of status." on public.entries for select using (auth.uid() = author_id);
create policy "Admins can view all entries." on public.entries for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can insert entries." on public.entries for insert with check (auth.uid() = author_id);
create policy "Users can update their own entries." on public.entries for update using (auth.uid() = author_id);
create policy "Admins can update all entries." on public.entries for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can delete their own entries." on public.entries for delete using (auth.uid() = author_id);
create policy "Admins can delete all entries." on public.entries for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
