-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with proper constraints and defaults
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    background_color TEXT DEFAULT '#79afd9',
    CONSTRAINT fk_user
        FOREIGN KEY (id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT username_check CHECK (username ~ '^[a-z0-9_]+$')
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies with proper checks
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles (id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

-- Create function to check if username exists
CREATE OR REPLACE FUNCTION public.check_username_exists(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE LOWER(username) = LOWER(username_to_check)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_val TEXT;
    display_name_val TEXT;
BEGIN
    -- Get values from metadata
    username_val := LOWER(NEW.raw_user_meta_data->>'username');
    display_name_val := NEW.raw_user_meta_data->>'display_name';
    
    -- Validate username
    IF username_val IS NULL OR username_val = '' THEN
        RAISE EXCEPTION 'Username cannot be empty';
    END IF;
    
    IF NOT (username_val ~ '^[a-z0-9_]+$') THEN
        RAISE EXCEPTION 'Username can only contain lowercase letters, numbers, and underscores';
    END IF;
    
    -- Check if username exists
    IF public.check_username_exists(username_val) THEN
        RAISE EXCEPTION 'Username already exists';
    END IF;
    
    -- Insert the profile
    INSERT INTO public.profiles (
        id,
        username,
        display_name,
        email,
        updated_at
    ) VALUES (
        NEW.id,
        username_val,
        COALESCE(display_name_val, username_val),
        LOWER(NEW.email),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error (optional)
        RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.check_username_exists TO anon;
GRANT EXECUTE ON FUNCTION public.check_username_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_username_exists TO service_role;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
