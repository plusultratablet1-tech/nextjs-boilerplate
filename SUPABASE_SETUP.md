# Supabase Setup Instructions for BearFitPH

This guide will help you set up your Supabase database to support user authentication and profile management.

## Step 1: Access Your Supabase Dashboard

1. Visit: https://app.supabase.com
2. Select your project **yctjcxtwbaaeigawfxkl**

## Step 2: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click the **+ New Query** button
3. A new SQL editor window will open

## Step 3: Run the Database Setup SQL

Copy the entire SQL block below and paste it into your SQL Editor:

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

4. Click the **Run** button (or press Ctrl+Enter)
5. You should see a green success message at the bottom

## Step 4: Verify the Table Was Created

1. Go to **Table Editor** in the left sidebar
2. You should see the new `user_profiles` table in the list
3. Click on it to verify the columns match the SQL schema above

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers** in the left sidebar
2. Make sure **Email** is enabled (toggle should be on)
3. Go to **Authentication** → **URL Configuration**
4. Add these Redirect URLs:
   - `http://localhost:3000/member/dashboard` (for development)
   - `https://yourdomain.com/member/dashboard` (for production)

## Step 6: Verify Environment Variables

Your environment variables are already configured. You can verify them in your project settings:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` = https://yctjcxtwbaaeigawfxkl.supabase.co
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon Key - already set)
- ✅ `SUPABASE_SERVICE_KEY` (Service Role Key - already set)

## Testing the Complete Flow

1. **Welcome Page**: Click "Get Started" button
2. **Sign Up**: Create a new account with:
   - Email: test@example.com
   - Password: SecurePassword123
   - Full Name: Your Name
3. **Dashboard**: You'll be automatically logged in and see your profile data
4. **Log Out**: Click the logout button in the dashboard
5. **Log In**: Sign back in with your credentials

All your profile data is now stored securely in Supabase with Row Level Security enabled!

## Troubleshooting

**Error: "user_profiles table doesn't exist"**
- Make sure you ran the SQL script in Step 3 successfully
- Verify the table exists in Table Editor

**Error: "CORS error or 401 Unauthorized"**
- Check that your environment variables are correctly set
- Verify your Supabase URL and keys in the SQL Editor's top-right

**Profile data not showing**
- Make sure you're logged in as an authenticated user
- Check that the user_profiles table has a row with your user ID
