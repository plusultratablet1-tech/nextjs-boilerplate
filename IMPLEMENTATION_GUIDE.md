# BearFitPH Authentication & User Management Implementation Guide

## Overview

Your BearFitPH app now has a complete authentication and user management system connected to Supabase. This guide explains the flow and how to finalize the setup.

---

## 🚀 What's Been Implemented

### 1. **Authentication System** ✅
- User signup with email, password, and full name
- User login with email and password
- Secure session management via Supabase Auth
- Logout functionality
- AuthContext for managing user state across the app

### 2. **User Profiles Database** (Needs Manual Setup)
- `user_profiles` table stores additional user data
- Auto-created when users sign up
- Fields: email, full_name, membership_package, membership_id, branch, status, profile_image_url, workout_streak, bearforce_points, prestige_member_season, fitness_level, sessions_completed, sessions_total, badges, role, timestamps

### 3. **UI Components** ✅
- **AuthModal**: Login/Signup modal with BearFitPH orange styling
- **LogoutButton**: Styled logout button (ready to add to dashboard)
- **Welcome Page**: Has "Get Started" button that opens AuthModal
- Uses your app's color scheme (#F37120 orange on dark background)

---

## 📋 Step 1: Set Up Supabase Database (CRITICAL)

### Go to Supabase Dashboard

1. Visit https://app.supabase.com
2. Select your project: **yctjcxtwbaaeigawfxkl**

### Create the user_profiles Table

1. Click **SQL Editor** in the left sidebar
2. Click **+ New Query**
3. Copy and paste this SQL:

```sql
-- Create user_profiles table
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
  sessions_completed INTEGER DEFAULT 40,
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

4. Click **Run** button
5. You should see: ✅ Success (or "Query executed successfully")

### Verify in Table Editor

1. Go to **Table Editor** in the sidebar
2. You should see `user_profiles` table listed
3. Click on it - you should see all the columns created

---

## 🔐 Step 2: Configure Email Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** and make sure it's **enabled** (toggle should be ON)
3. Go to **Authentication** → **URL Configuration**
4. Under "Redirect URLs", add:
   - `http://localhost:3000/member/dashboard` (for local development)
   - `https://yourdomain.com/member/dashboard` (replace with your domain for production)

### Verify Email Provider Settings

- **Autoconfirm**: You can leave this OFF for real production (users must confirm email)
- **Double confirm changes**: OFF for now
- These can be adjusted later in settings if needed

---

## 🔑 Step 3: Verify Environment Variables

Your environment variables should already be configured. Check your project settings:

**In v0 Settings → Vars:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = https://yctjcxtwbaaeigawfxkl.supabase.co
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (should be set)
- ✅ `SUPABASE_SERVICE_KEY` = (should be set)

If any are missing, add them from your Supabase project settings (API section).

---

## 🎯 Step 4: Test the Complete Flow

### **Test Flow: Welcome → Sign Up → Dashboard → Log Out → Log In**

1. **Open the app** at `http://localhost:3000/welcome`
2. **Click "Get Started"** button
3. **Sign Up** tab opens:
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Full Name: `Test User`
4. **Click "Create Account"** button
5. **You should be redirected** to the dashboard automatically
6. **Your profile card should show**:
   - Your name (Test User)
   - Membership: Full 48 Package+
   - Membership ID: M[timestamp]
   - Status: Active
   - All stats should populate

### **Log Out & Log Back In**

1. Click the **Logout** button (should be added to dashboard header or profile section)
2. You'll be redirected to the welcome page
3. Click "Get Started" again
4. **Sign In** tab opens:
   - Email: `test@example.com`
   - Password: `TestPass123!`
5. **Click "Sign In"** button
6. **Dashboard loads with your profile data** - data persists!

---

## 📱 How the System Works

### **User Signs Up:**
```
User fills form → Supabase Auth creates user → 
AuthContext creates user_profiles row → User auto-logged in → Dashboard shows profile data
```

### **User Logs In:**
```
User enters credentials → Supabase Auth verifies → 
AuthContext fetches user_profiles data → Dashboard displays real data
```

### **User Logs Out:**
```
Click Logout → Auth session cleared → Redirected to welcome page
```

---

## 🔧 Architecture Overview

### **AuthContext** (`lib/auth/AuthContext.tsx`)
- Manages user authentication state
- Handles signUp, signIn, signOut
- Fetches and stores user profile data
- Available via `useAuth()` hook

### **AuthModal** (`components/auth/AuthModal.tsx`)
- Reusable login/signup modal
- Triggered by "Get Started" button on welcome page
- Has signup and signin tabs
- Shows with `<AuthModal open={open} onOpenChange={setOpen} />`

### **LogoutButton** (`components/auth/LogoutButton.tsx`)
- Simple logout button component
- Can be added to dashboard header or profile section
- Uses `useAuth().signOut()`

### **User Profile Data Flow**
1. User logs in → AuthContext fetches from `user_profiles` table
2. Data available via `useAuth().userProfile`
3. Dashboard displays: `userProfile?.full_name`, `userProfile?.membership_id`, etc.

---

## 🎨 Color Scheme (Already Implemented)

- **Primary Orange**: `#F37120` (all buttons, highlights)
- **Dark Background**: `#0a0a0a` to `#1a1a1a`
- **Text**: White (`#ffffff`) and grays (`#e5e7eb`, `#9ca3af`)
- **Accent**: Orange highlights on dark theme

**All auth components already match your app's design!**

---

## 📊 Dashboard Integration

### Update Dashboard to Show Real User Data

The dashboard currently uses mock data. To connect it to Supabase:

1. Add import at top of dashboard page:
```javascript
import { useAuth } from '@/lib/auth/AuthContext';
```

2. Inside component function, get user profile:
```javascript
const { userProfile, user } = useAuth();
```

3. Use real data in profile card:
```javascript
<h2>{userProfile?.full_name || 'User'}</h2>
<p>ID: {userProfile?.membership_id}</p>
<p>Branch: {userProfile?.branch}</p>
<p>Sessions: {userProfile?.sessions_completed}/{userProfile?.sessions_total}</p>
```

4. Add logout button to dashboard:
```javascript
import { LogoutButton } from '@/components/auth/LogoutButton';
// Then in your header/profile section:
<LogoutButton />
```

---

## 🚨 Troubleshooting

### **Error: "user_profiles table doesn't exist"**
- ❌ Problem: You haven't run the SQL migration
- ✅ Solution: Go back to Step 1 and run the SQL in the Supabase SQL Editor

### **Error: "401 Unauthorized" or CORS error**
- ❌ Problem: Environment variables not set correctly
- ✅ Solution: 
  - Check your env vars in v0 Settings → Vars
  - Make sure they match exactly from Supabase (API section)
  - No extra spaces or quotes

### **Sign up works but dashboard shows empty profile**
- ❌ Problem: User data not being fetched
- ✅ Solution: 
  - Check browser console for errors
  - Verify user_profiles table has a row for your user
  - Check RLS policies are enabled

### **"New users can't see their data"**
- ❌ Problem: RLS policies blocking access
- ✅ Solution:
  - Go to Supabase → Table Editor → user_profiles → RLS Policies
  - Verify all 3 policies are enabled:
    1. "Users can view their own profile"
    2. "Users can update their own profile"
    3. "Service role can manage profiles"

### **"Can't log out properly"**
- ❌ Problem: Session not clearing
- ✅ Solution:
  - Check browser localStorage/cookies are being cleared
  - Try incognito window
  - Clear browser cache and try again

---

## ✨ Next Steps

After setup is working:

1. **Customize default user data** - adjust defaults in SQL (membership_package, branch, etc.)
2. **Add user profile editing** - let users update their info
3. **Add profile picture upload** - store images in Supabase Storage
4. **Add password reset** - implement forgot password flow
5. **Add email verification** - enable email confirmation
6. **Analytics** - track user signups, logins

---

## 📞 Support

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Check Supabase logs: https://app.supabase.com → Logs
3. Check browser console for error messages (F12 → Console)
4. Verify all steps in this guide were completed

---

## Summary

**What you have:**
- ✅ Full authentication system
- ✅ User profiles database (needs setup)
- ✅ Login/signup UI with brand colors
- ✅ Logout functionality
- ✅ AuthContext for state management

**What you need to do:**
- Run the SQL migration (Step 1 - CRITICAL!)
- Test the signup/login flow
- Update dashboard to show real user data (optional but recommended)

**Your app is now ready for real user authentication!** 🚀
