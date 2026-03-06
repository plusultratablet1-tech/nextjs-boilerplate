# Supabase Setup Instructions

Follow these steps to set up your Supabase database for the BearFitPH app.

## Step 1: Go to Your Supabase Dashboard

Visit: https://app.supabase.com/projects and select your project (yctjcxtwbaaeigawfxkl)

## Step 2: Open SQL Editor

1. Click on **SQL Editor** in the left sidebar
2. Click **+ New Query**

## Step 3: Run the Setup SQL

Copy and paste the following SQL into the editor and click **Run**:

```sql
-- Create user_profiles table to store additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  membership_package TEXT DEFAULT 'Full 48 Package+',
  membership_id TEXT UNIQUE,
  branch TEXT DEFAULT 'Malingap Branch',
  status TEXT DEFAULT 'Active',
  profile_image_url TEXT,
  workout_streak INTEGER DEFAULT 0,
  bearforce_points INTEGER DEFAULT 0,
  prestige_member_season TEXT DEFAULT 'Season 2',
  fitness_level TEXT DEFAULT 'A+',
  sessions_completed INTEGER DEFAULT 0,
  sessions_total INTEGER DEFAULT 48,
  badges TEXT[] DEFAULT ARRAY['Top Member', 'Verified', 'On Target']::TEXT[],
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT valid_status CHECK (status IN ('Active', 'Inactive'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_membership_id ON user_profiles(membership_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Allow service role to manage all profiles
CREATE POLICY "Service role can manage profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Verify the Setup

After running the SQL:
1. Go to **Table Editor** in the left sidebar
2. You should see `user_profiles` table listed
3. The table should have the columns shown in the SQL above

## Step 5: Environment Variables

Make sure these environment variables are set in your project settings:

- `NEXT_PUBLIC_SUPABASE_URL` = https://yctjcxtwbaaeigawfxkl.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Anon Key
- `SUPABASE_SERVICE_KEY` = Your Service Role Key

These are already configured in your project.

## Done!

Your Supabase database is now ready. The app will automatically create user profiles when new users sign up.
