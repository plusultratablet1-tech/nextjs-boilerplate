# 🚀 Quick Start Guide - BearFitPH Auth & Dashboard

## Your Current Situation
✅ **Done**: Auth context, login/signup modal, profile integration
❌ **Needed**: Supabase table setup (5-10 minutes)

---

## Step 1: Setup Supabase Database (DO THIS NOW!)

### Open Supabase Console
- Go to: https://app.supabase.com
- Select project: `yctjcxtwbaaeigawfxkl`
- Click: **SQL Editor** → **New Query**

### Paste and Execute
Open the file `SUPABASE_SETUP.md` in your project and copy the SQL code block.

Paste it into Supabase SQL Editor and click **Run**.

✅ **This creates**:
- `user_profiles` table
- Indexes for fast queries
- Security rules (RLS)
- Auto-update timestamps

---

## Step 2: Test the Flow

### Test Sign Up
1. Click "Get Started" button on welcome page
2. Click "Sign Up" tab
3. Enter:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Password: "TestPass123!"
4. Click "Create Account"
5. Check dashboard - you should see your data!

### Test Sign In
1. Log out (click logout button once added)
2. Click "Get Started"
3. Click "Sign In" tab
4. Use credentials from step 3
5. Dashboard should load with your data

---

## Step 3: Add Logout Button (Optional - For Next Chat)

In `/components/bearfit/header.tsx`, add this:

```tsx
import { LogoutButton } from "@/components/auth/LogoutButton"

// Inside your header component, add:
<LogoutButton />
```

---

## Where Everything Connects

```
User Action → AuthModal Component
    ↓
User submits form → AuthContext (sign-up/sign-in)
    ↓
Supabase Auth + Database
    ↓
Profile data fetched → Stored in AuthContext
    ↓
ProfileCard Component reads useAuth()
    ↓
Dashboard displays real data ✨
```

---

## Environment Variables

Already set in your project:
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_KEY` ✓

No additional setup needed!

---

## Files You Can Read

- `SUPABASE_SETUP.md` - Database setup SQL
- `IMPLEMENTATION_SUMMARY.md` - What's been done & what's next
- `/lib/auth/AuthContext.tsx` - How auth works
- `/components/auth/AuthModal.tsx` - Login/signup form

---

## Common Issues

**"Table doesn't exist" error**
- → Run the SQL from SUPABASE_SETUP.md again
- → Make sure you're in the right project

**"Auth modal not opening"
- → Check welcome page has `<AuthModal />` at bottom
- → Check layout has `<AuthProvider>` wrapper

**"Dashboard shows "User" instead of real name**
- → User profile row not created in Supabase
- → Make sure user_profiles table exists
- → Create a test user and check if row was inserted

---

## Next Steps Summary

1. ✅ Run SUPABASE_SETUP.md SQL (5 min)
2. ✅ Test sign-up/sign-in (5 min)
3. → Add logout button to header (5 min)
4. → Update other dashboard components (30 min)
5. → Protected routes + error handling (optional)

You're super close! Just need the database setup. 🎉
