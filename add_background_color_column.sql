ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS background_color text DEFAULT '#79afd9';
