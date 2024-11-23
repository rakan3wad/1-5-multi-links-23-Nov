-- Drop existing policies if they exist
drop policy if exists "Users can update their own links" on links;
drop policy if exists "Users can update link order" on links;

-- Create policy for updating links
create policy "Users can update their own links"
  on links for update
  using ( auth.uid() = user_id );

-- Create policy specifically for updating order_index
create policy "Users can update link order"
  on links for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Add delete policy if it doesn't exist
drop policy if exists "Users can delete their own links" on links;
create policy "Users can delete their own links"
  on links for delete
  using ( auth.uid() = user_id );
