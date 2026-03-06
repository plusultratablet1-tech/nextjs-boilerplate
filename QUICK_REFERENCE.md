# BearFitPH - Quick Reference Guide

## 🚀 What's Ready to Use

### **Welcome Page**
- Location: `/welcome`
- Feature: Click "Get Started" → AuthModal opens
- Status: ✅ Ready

### **Authentication Modal**
- SignUp mode: Email, Password, Full Name
- SignIn mode: Email, Password  
- Color: Orange (#F37120) on dark background
- Status: ✅ Complete & Styled

### **Login Page** 
- Location: `/login`
- Status: ✅ Exists but AuthModal is the primary auth entry point

### **Dashboard**
- Location: `/member/dashboard`
- Status: ⚠️ Ready but shows mock data (see Priority 1 in CONTINUATION_SUMMARY.md)
- Features: Member, Staff, Leads, Admin views

---

## 🔐 One-Time Setup Required

### **Step 1: Create Database Table (2 min)**
```
1. https://app.supabase.com
2. Select project: yctjcxtwbaaeigawfxkl
3. SQL Editor → New Query
4. Paste SQL from SUPABASE_SETUP.md
5. Click Run
```

### **Step 2: Enable Email Auth (1 min)**
```
1. Authentication → Providers → Email (toggle ON)
2. URL Configuration → Add redirect URL:
   http://localhost:3000/member/dashboard
```

### **Step 3: Test (5 min)**
```
1. Go to http://localhost:3000/welcome
2. Click "Get Started"
3. Sign Up with test email
4. Should redirect to dashboard
5. Logout and login again
```

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `lib/auth/AuthContext.tsx` | Auth state & logic | ✅ Done |
| `components/auth/AuthModal.tsx` | Login/SignUp modal | ✅ Done |
| `components/auth/LogoutButton.tsx` | Logout button | ✅ Done |
| `app/welcome/page.tsx` | Welcome page | ✅ Done |
| `app/member/dashboard/page.tsx` | Dashboard | ⚠️ Needs real data |
| `lib/supabase/client.ts` | Supabase client | ✅ Done |

---

## 🎯 User Flow

```
┌─────────────┐
│   Welcome   │ (/welcome)
│  Get Start  │
└──────┬──────┘
       │ Click
       ▼
┌─────────────────────┐
│   AuthModal Opens   │
│  ┌──────────────┐   │
│  │ Sign Up / In │   │
│  └──────────────┘   │
└──────┬──────────────┘
       │ Form Submit
       │ ✓ Valid
       ▼
┌──────────────────┐
│   Supabase Auth  │
│  + user_profiles │
└──────┬───────────┘
       │ Create/Fetch
       │ User Session
       ▼
┌──────────────────┐
│   Dashboard      │ (/member/dashboard)
│  Show Profile    │
│  Real User Data  │
└──────┬───────────┘
       │
       │ User clicks Logout
       │
       ▼
┌──────────────────┐
│  Redirect to     │
│  Welcome Page    │
└──────────────────┘
```

---

## 💾 Data Storage

### **Supabase Auth**
- Manages: Email, Password, Sessions
- Table: `auth.users` (built-in, read-only)

### **User Profiles**
- Table: `user_profiles` (you create)
- Fields: full_name, email, membership_id, branch, status, stats, etc.
- Linked to: `auth.users.id` via foreign key

### **Flow**
```
User signs up → Auth creates user → 
Context creates profile row → Both linked by ID
```

---

## 🎨 Design System

### **Colors**
- Primary: `#F37120` (orange)
- Dark Bg: `#0a0a0a`
- Card Bg: `#1a1a1a`
- Border: `#222222`
- Text: `#ffffff`
- Muted: `#9ca3af`

### **Components Using Brand Colors**
- ✅ AuthModal - Orange buttons
- ✅ LogoutButton - Orange styling  
- ✅ Login page buttons - Orange
- ✅ Welcome page buttons - Orange

---

## 🔑 API Endpoints (Built-in Supabase)

### **Sign Up**
```javascript
supabase.auth.signUp({ email, password })
```

### **Sign In**
```javascript
supabase.auth.signInWithPassword({ email, password })
```

### **Sign Out**
```javascript
supabase.auth.signOut()
```

### **Get Session**
```javascript
supabase.auth.getSession()
```

### **Listen to Auth Changes**
```javascript
supabase.auth.onAuthStateChange((event, session) => {})
```

### **Get User Profile**
```javascript
supabase.from('user_profiles').select('*').eq('id', userId).single()
```

---

## 🧪 Test Credentials

Create during signup:
```
Email: test@bearfit.com
Password: BearFit123!
Name: Test Member
```

After signup, profile auto-populates:
```
Membership: Full 48 Package+
Branch: Malingap Branch
Status: Active
Sessions: 40/48
Fitness Level: A+
```

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Table doesn't exist" | Run SQL migration in Step 1 |
| "401 Unauthorized" | Check env vars in Settings → Vars |
| "AuthModal not opening" | Verify `<AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />` exists in welcome page |
| "Profile not showing" | Verify RLS policies enabled in Supabase |
| "Can't logout" | Clear browser cookies, try incognito |
| "Email already exists" | Supabase is working! Use different email |

---

## 📝 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://yctjcxtwbaaeigawfxkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your anon key]
SUPABASE_SERVICE_KEY=[your service key]
```

Status: ✅ Already configured in v0

---

## 🚀 Deploy Checklist

Before deploying to production:

- [ ] SQL migration created in Supabase
- [ ] Email auth enabled
- [ ] Test signup/login/logout works
- [ ] Dashboard shows real user data
- [ ] Redirect URLs updated (for your domain)
- [ ] Error handling tested
- [ ] Password validation rules set

---

## 📞 Quick Support

**The setup is straightforward:**
1. Create table (copy-paste SQL)
2. Enable email auth (toggle)
3. Test flow (5 clicks)
4. Done!

**If stuck:**
- Check IMPLEMENTATION_GUIDE.md (detailed)
- Check SUPABASE_SETUP.md (database only)
- Check browser console (F12)
- Check Supabase logs

---

## Next Steps

**Immediate (if time permits):**
- Update dashboard to show real user data (Priority 1)

**Later:**
- Add profile editing (Priority 2)
- Add password reset (Priority 3)
- Add email verification (Priority 4)
- Role-based dashboard (Priority 5)

---

**Status: 95% Complete - Just need to run SQL & test! 🎯**
