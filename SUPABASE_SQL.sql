-- Create user_profiles table for BearFitPH
-- This stores additional user data beyond Supabase's built-in auth.users

CREATE TABLE IF NOT EXISTS public.user_profiles (
  -- Primary key linked to auth.users
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  profile_image_url TEXT,
  
  -- Membership details
  membership_package TEXT DEFAULT 'Full 48 Package+',
  membership_id TEXT UNIQUE,
  branch TEXT DEFAULT 'Malingap Branch',
  status TEXT DEFAULT 'Active',
  role TEXT DEFAULT 'Member',
  
  -- Fitness stats
  workout_streak INTEGER DEFAULT 0,
  bearforce_points INTEGER DEFAULT 0,
  prestige_member_season TEXT,
  fitness_level TEXT DEFAULT 'A+',
  
  -- Session tracking
  sessions_completed INTEGER DEFAULT 0,
  sessions_total INTEGER DEFAULT 48,
  
  -- Badges and achievements
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update 'updated_at' on changes
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
