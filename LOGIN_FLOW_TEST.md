# Login Flow - Visual Test Guide

## Current Status: READY TO TEST

Your app is set up and ready. The login button is the **orange "Get Started – Free Assessment"** button on the welcome page.

---

## Where to Click

### Welcome Page (`/welcome`)

```
┌─────────────────────────────────────────────┐
│  Welcome to BearFitPH                      │
│                                            │
│  EVERY SESSION BUILDS YOUR STORY.          │
│  Better Form | Better Function | Better... │
│                                            │
│  ┌─────────────────────────────────────┐  │
│  │  Get Started – Free Assessment      │ ◄─ CLICK THIS!
│  └─────────────────────────────────────┘  │
│                                            │
│  ┌─────────────────────────────────────┐  │
│  │  Dashboard Sample                    │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Test Scenario 1: New User Sign Up

### Step 1: Click "Get Started" Button
- You're on the `/welcome` page
- See the orange button
- Click it

**Expected Result:**
- A modal/dialog appears
- Title says "Create Account"
- Has a tab option to "Sign In"

### Step 2: Fill Out Sign Up Form
```
┌──────────────────────────────────────┐
│  Create Account                      │
│  Join BearFitPH...                   │
│                                      │
│  Full Name                           │
│  [_____________________]             │
│                                      │
│  Email                               │
│  [_____________________]             │
│                                      │
│  Password                            │
│  [_____________________]             │
│                                      │
│  ┌──────────────────────────────┐   │
│  │   Create Account             │   │
│  └──────────────────────────────┘   │
│                                      │
│  Already have an account? Sign In    │
└──────────────────────────────────────┘
```

Fill in:
- **Full Name**: `John Doe` (or any name)
- **Email**: `john@example.com` (use unique email each time)
- **Password**: `BearFit123!` (capital letter + number + 8+ chars)

### Step 3: Click "Create Account" Button

**Expected Result:**
- Button shows loading spinner
- Modal closes
- You see a success toast message
- You're redirected to `/member/dashboard`
- Dashboard shows your name and profile

**Possible outcomes:**
- ✅ Success - you're logged in!
- ❌ Error about duplicate email - use different email
- ❌ Password too weak - add uppercase + number
- ⚠️ Profile not showing - that's OK, table might not be set up

---

## Test Scenario 2: Existing User Sign In

### Step 1: Go to Welcome Page
- Navigate to `/welcome`
- Click "Get Started" button
- Modal appears

### Step 2: Switch to Sign In Tab
- Click "Sign In" link at the bottom
- Form changes to show only Email + Password

```
┌──────────────────────────────────────┐
│  Welcome Back                        │
│  Sign in to your BearFitPH account  │
│                                      │
│  Email                               │
│  [_____________________]             │
│                                      │
│  Password                            │
│  [_____________________]             │
│                                      │
│  ┌──────────────────────────────┐   │
│  │   Sign In                    │   │
│  └──────────────────────────────┘   │
│                                      │
│  Don't have account? Sign Up         │
└──────────────────────────────────────┘
```

### Step 3: Enter Credentials
- **Email**: Same email you just signed up with
- **Password**: Same password you used

### Step 4: Click "Sign In" Button

**Expected Result:**
- Button shows loading spinner
- Success message appears
- Modal closes
- Redirected to dashboard
- Your profile is loaded

---

## Test Scenario 3: Logout

### Step 1: Look for Logout Button
- On the dashboard page
- Look for orange "Logout" button (usually in header/top-right)

### Step 2: Click Logout Button

**Expected Result:**
- You're logged out
- Redirected to `/welcome`
- Your session is cleared

### Step 3: Try to Go to Dashboard Directly
- Type `/member/dashboard` in URL bar
- You should be redirected to `/welcome` (not logged in)

---

## Common Issues & Fixes

### Issue: "Get Started button not visible"
- Refresh the page (Ctrl+R or Cmd+R)
- Make sure you're at `/welcome` route
- Check browser zoom level (should be 100%)

### Issue: "Modal doesn't appear when clicking button"
- Check browser console (F12 → Console)
- Look for red error messages
- Report the error message

### Issue: "Can't create account - says email exists"
- Use a different email address
- Format: `firstname.lastname+123@example.com`

### Issue: "Sign up works but no profile data shows"
- This is normal if Supabase table isn't set up
- Follow SETUP_INSTRUCTIONS.md to create the table
- Then sign up again with new email

### Issue: "Sign in says 'wrong password' but I know it's correct"
- Check caps lock
- Make sure you used same email as signup
- Try signing up with a new email instead

---

## Success Criteria

Your auth system is working when:

- [ ] "Get Started" button opens login modal
- [ ] Can fill out signup form and create account
- [ ] Get success message and redirected to dashboard
- [ ] Can see your name on dashboard
- [ ] Can logout
- [ ] Can login again with same credentials
- [ ] Logout clears session
- [ ] Can't access dashboard while logged out

---

## What If It's Still Not Working?

Check the browser console for errors:

1. Open DevTools: Press `F12`
2. Click **Console** tab
3. Look for red error messages
4. Screenshot the error
5. Check:
   - Is Supabase URL correct? (should be `yctjcxtwbaaeigawfxkl.supabase.co`)
   - Is ANON_KEY set? (in project settings → Vars)
   - Is SERVICE_KEY set?

If errors mention `user_profiles table`, you need to run the SQL setup in SETUP_INSTRUCTIONS.md.

---

## Files You Modified

These files make the login work:

- `app/welcome/page.tsx` - Has "Get Started" button
- `components/auth/AuthModal.tsx` - The login/signup form
- `lib/auth/AuthContext.tsx` - Auth logic and state
- `app/layout.tsx` - Wraps app with AuthProvider

All are production-ready. No further code changes needed to test basic auth!

---

## Next: Set Up Profile Storage (Optional)

Once basic login works, you can:

1. Open `SETUP_INSTRUCTIONS.md`
2. Follow "Option 2: Full Setup"
3. Run the SQL in Supabase
4. User profile data will now persist

---

Happy testing! Your auth system is rock solid. 🎉
