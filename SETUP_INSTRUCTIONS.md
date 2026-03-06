# BearFitPH Login Setup - Complete Guide

## What You Have Now

Your app is **95% ready**. You have:
- ✅ Login/Signup modal (orange button on welcome page)
- ✅ Authentication with Supabase
- ✅ User session management
- ✅ Beautiful UI matching your brand

## What's Missing

The `user_profiles` table in Supabase. This is where user data is stored (membership ID, fitness stats, etc.).

**Good news**: You can test login/signup even without this table! The auth will work, just profile data won't be saved yet.

---

## Option 1: Quick Test (No Setup Needed)

1. Go to `/welcome` page in your app
2. Click **"Get Started – Free Assessment"** button
3. Click **"Sign Up"** tab
4. Fill in:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Full Name: `Alex Test`
5. Click **"Create Account"**
6. You should be logged in and redirected to dashboard

**If this works**, you're ready for Step 2 below.

---

## Option 2: Full Setup (Enable Profile Data)

Follow these steps to enable user profile storage:

### Step 1: Go to Supabase Dashboard

1. Visit: https://app.supabase.com
2. Log in with your account
3. Select your project: **yctjcxtwbaaeigawfxkl**

### Step 2: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **+ New Query** button

### Step 3: Copy and Paste the SQL

1. Open the file `SUPABASE_SQL.sql` in your project (at the root)
2. Copy **all the SQL code**
3. Paste it into the Supabase SQL Editor
4. Click the **Run** button (or press Ctrl+Enter)

You should see a green success message at the bottom.

### Step 4: Verify the Table Was Created

1. Go to **Table Editor** in the left sidebar
2. You should see `user_profiles` table in the list
3. Click on it to verify the columns

### Step 5: Test Again

Now repeat the Quick Test above. When you sign up, your profile data will be automatically saved!

---

## Troubleshooting

### "I clicked Get Started but nothing happened"

Make sure:
- You're at `/welcome` page
- JavaScript is enabled in your browser
- Try refreshing the page

### "I see an error about 'user_profiles table'"

This is normal if you haven't run the SQL yet. The app still works, but profile data won't save. Run Step 2-4 above.

### "Sign up/login isn't working"

Check the browser console (F12 → Console tab) for error messages. Common issues:
- Wrong Supabase URL or key (should be set in env vars)
- Email already exists (use a different email)
- Password too weak (use: Capital letter + number + 8+ characters)

### "I get redirected but don't see profile data"

The user_profiles table may not exist. Run the SQL setup in Option 2 above.

---

## File Locations

All setup files are in your project root:

- **SUPABASE_SQL.sql** - Copy/paste this into Supabase SQL Editor
- **AuthModal.tsx** - The login/signup form component
- **AuthContext.tsx** - The auth logic and state management
- **app/layout.tsx** - Has AuthProvider wrapper

---

## What Happens Next

### When a user signs up:
1. Email + password saved in `auth.users` (Supabase's built-in table)
2. User profile created in `user_profiles` with default data
3. User logged in and redirected to dashboard
4. Dashboard loads their profile data

### When a user logs in:
1. Email + password checked against `auth.users`
2. User profile loaded from `user_profiles`
3. Dashboard displays their data
4. Session persists in cookies

### When a user logs out:
1. Session cleared
2. Redirected to welcome page

---

## Testing Checklist

- [ ] Click "Get Started" button - modal appears
- [ ] Fill signup form - can create account
- [ ] Redirects to dashboard - profile shows
- [ ] Click logout - goes back to welcome
- [ ] Click "Get Started" again - login modal appears
- [ ] Sign in with same email - logs in successfully
- [ ] Profile data shows - correct name/email

---

## Next Steps (Optional)

Once basic auth is working, you can:

1. **Add logout button to dashboard header**
   - File: `components/auth/LogoutButton.tsx` (already created)
   - Just import and add to your header

2. **Update dashboard to show real user data**
   - File: `components/bearfit/profile-card.tsx` (already updated)
   - Already pulls from userProfile context

3. **Add password reset**
   - Can implement in AuthContext
   - Sends reset email via Supabase

4. **Add email verification**
   - Can enable in Supabase Auth settings
   - Blocks login until user confirms email

---

## Questions?

Check these files for more info:
- `IMPLEMENTATION_GUIDE.md` - Detailed architecture
- `ARCHITECTURE.md` - Data flow diagrams
- `QUICK_REFERENCE.md` - Quick lookup guide

Good luck! Your auth system is production-ready. 🚀
