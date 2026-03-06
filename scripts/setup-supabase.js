import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupDatabase = async () => {
  try {
    console.log('Setting up Supabase database...');

    // Create user_profiles table
    const { error: tableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL UNIQUE,
          full_name TEXT,
          membership_package TEXT DEFAULT 'Basic',
          membership_id TEXT UNIQUE,
          branch TEXT,
          status TEXT DEFAULT 'Active',
          profile_image_url TEXT,
          workout_streak INTEGER DEFAULT 0,
          bearforce_points INTEGER DEFAULT 0,
          prestige_member_season TEXT,
          fitness_level TEXT DEFAULT 'A+',
          sessions_completed INTEGER DEFAULT 0,
          sessions_total INTEGER DEFAULT 0,
          badges TEXT[] DEFAULT ARRAY[]::TEXT[],
          role TEXT DEFAULT 'Member',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
          CONSTRAINT valid_status CHECK (status IN ('Active', 'Inactive'))
        );

        CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_membership_id ON user_profiles(membership_id);

        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON user_profiles
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON user_profiles
          FOR UPDATE USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);

        CREATE POLICY IF NOT EXISTS "Service role can manage profiles" ON user_profiles
          FOR ALL USING (auth.role() = 'service_role')
          WITH CHECK (auth.role() = 'service_role');

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = TIMEZONE('utc'::text, NOW());
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER IF NOT EXISTS update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (tableError) {
      console.error('Error creating table:', tableError);
      process.exit(1);
    }

    console.log('✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
