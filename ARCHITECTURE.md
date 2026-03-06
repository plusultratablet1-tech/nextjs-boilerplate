# BearFitPH - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js App                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐       ┌──────────────────┐           │
│  │   Welcome Page   │       │    Dashboard     │           │
│  │  (/welcome)      │       │  (/member/...)   │           │
│  │                  │       │                  │           │
│  │ [Get Started]◄──────────►│ Show Profile     │           │
│  └────────┬─────────┘       │ Show Stats       │           │
│           │                 │ Show Badges      │           │
│           │                 │ [Logout]         │           │
│           │                 └──────┬───────────┘           │
│           │                        │                       │
│     ┌─────▼──────────────┐         │                       │
│     │   AuthModal        │         │                       │
│     │                    │         │                       │
│     │  [Sign Up] [Sign In]        │                       │
│     │  Email, Password   │         │                       │
│     │  Full Name (signup)│         │                       │
│     └────────┬───────────┘         │                       │
│              │                     │                       │
│       ┌──────▼──────────────────────────┐                  │
│       │       AuthContext                │                  │
│       │  (lib/auth/AuthContext.tsx)     │                  │
│       │                                 │                  │
│       │  • signUp()                     │                  │
│       │  • signIn()                     │                  │
│       │  • signOut()                    │                  │
│       │  • fetchUserProfile()           │                  │
│       │  • useAuth() hook               │                  │
│       │                                 │                  │
│       │  State:                         │                  │
│       │  • user (auth.users)            │                  │
│       │  • userProfile (profiles)       │                  │
│       │  • loading                      │                  │
│       └──────┬──────────────────────────┘                  │
│              │                                              │
└──────────────┼──────────────────────────────────────────────┘
               │
        ┌──────▼──────────────────────┐
        │    Supabase Client           │
        │ (lib/supabase/client.ts)     │
        │                              │
        │ • Auth methods               │
        │ • Database queries           │
        └──────┬───────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────┐
│              Supabase Backend                                  │
├────────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐      │
│  │   PostgreSQL DB      │      │  Auth Service        │      │
│  │                      │      │                      │      │
│  │ ┌────────────────┐   │      │  • Email/Password    │      │
│  │ │ user_profiles  │   │      │  • Session mgmt      │      │
│  │ ├────────────────┤   │      │  • JWT tokens        │      │
│  │ │ id (UUID)      │───┼──────┼─ FK: auth.users.id   │      │
│  │ │ email          │   │      │                      │      │
│  │ │ full_name      │   │      │  Built-in Tables:    │      │
│  │ │ membership_id  │   │      │  • auth.users        │      │
│  │ │ branch         │   │      │  • auth.sessions     │      │
│  │ │ status         │   │      └──────────────────────┘      │
│  │ │ workout_streak │   │                                    │
│  │ │ bearforce_pts  │   │      ┌──────────────────────┐      │
│  │ │ fitness_level  │   │      │  Row Level Security  │      │
│  │ │ sessions_*     │   │      │  (RLS Policies)      │      │
│  │ │ badges[]       │   │      │                      │      │
│  │ │ created_at     │   │      │  ✓ Users view own    │      │
│  │ │ updated_at     │   │      │  ✓ Users update own  │      │
│  │ └────────────────┘   │      │  ✓ Service role all  │      │
│  │                      │      └──────────────────────┘      │
│  │ Indexes:             │                                    │
│  │ • email              │                                    │
│  │ • membership_id      │                                    │
│  └──────────────────────┘                                    │
│                                                               │
└────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### **Sign Up Flow**

```
User clicks "Get Started"
        │
        ▼
AuthModal opens (Sign Up tab)
        │
User enters:
├─ Email
├─ Password  
└─ Full Name
        │
        ▼
User clicks "Create Account"
        │
        ▼
AuthContext.signUp() called
        │
        ├─ Supabase.auth.signUp()
        │  └─ Creates auth.users row
        │     └─ Assigns UUID
        │
        └─ Create user_profiles row
           ├─ id = UUID (from auth.users)
           ├─ email
           ├─ full_name
           ├─ Default values:
           │  ├─ membership_package: "Full 48 Package+"
           │  ├─ branch: "Malingap Branch"
           │  ├─ status: "Active"
           │  ├─ role: "Member"
           │  └─ Other defaults...
           │
           └─ RLS Policy checks:
              └─ Service role can insert ✓
        │
        ▼
Session created (httpOnly cookie)
        │
        ▼
AuthContext updates:
├─ user = auth.users object
└─ userProfile = user_profiles data
        │
        ▼
Redirect to /member/dashboard
        │
        ▼
Dashboard displays user data:
├─ Profile card shows name
├─ Stats show from userProfile
└─ All data is real ✓
```

### **Sign In Flow**

```
User clicks "Get Started"
        │
        ▼
AuthModal opens (Sign In tab)
        │
User enters:
├─ Email
└─ Password
        │
        ▼
User clicks "Sign In"
        │
        ▼
AuthContext.signIn() called
        │
        ├─ Supabase.auth.signInWithPassword()
        │  └─ Validates credentials
        │     └─ Returns auth.users object
        │
        └─ Fetch from user_profiles
           ├─ Query: SELECT * FROM user_profiles WHERE id = userId
           ├─ RLS Policy check:
           │  └─ User can view their own profile ✓
           │
           └─ Return user_profiles data
        │
        ▼
Session created (httpOnly cookie)
        │
        ▼
AuthContext updates:
├─ user = auth.users object
└─ userProfile = user_profiles data
        │
        ▼
Redirect to /member/dashboard
        │
        ▼
Dashboard renders with real data
(same user sees same profile they created)
```

### **Logout Flow**

```
User clicks "Logout" button
        │
        ▼
LogoutButton component
        │
        ▼
AuthContext.signOut() called
        │
        ├─ Supabase.auth.signOut()
        │  └─ Invalidate session/JWT
        │
        └─ Clear AuthContext state:
           ├─ user = null
           └─ userProfile = null
        │
        ▼
httpOnly cookie cleared by Supabase
        │
        ▼
Redirect to /welcome
        │
        ▼
User can see "Get Started" again
(can signup again or signin)
```

---

## Database Structure

### **auth.users** (Built-in, Supabase Managed)
```sql
┌──────────────────────────────────┐
│ auth.users                       │ (Read-only)
├──────────────────────────────────┤
│ id (UUID) ◄── PK                 │
│ email                            │
│ encrypted_password               │
│ email_confirmed_at               │
│ last_sign_in_at                  │
│ created_at                       │
│ updated_at                       │
│ raw_app_meta_data                │
│ raw_user_meta_data               │
│ ... (other fields)               │
└──────────────────────────────────┘
```

### **user_profiles** (Your Table)
```sql
┌────────────────────────────────────────────┐
│ user_profiles                              │
├────────────────────────────────────────────┤
│ id (UUID) ◄── PK, FK: auth.users.id       │
│ email (TEXT, UNIQUE)                       │
│ full_name (TEXT)                           │
│ membership_package (TEXT)                  │
│ membership_id (TEXT, UNIQUE)               │
│ branch (TEXT)                              │
│ status (TEXT)                              │
│ profile_image_url (TEXT)                   │
│ workout_streak (INTEGER)                   │
│ bearforce_points (INTEGER)                 │
│ prestige_member_season (TEXT)              │
│ fitness_level (TEXT)                       │
│ sessions_completed (INTEGER)               │
│ sessions_total (INTEGER)                   │
│ badges (TEXT[] array)                      │
│ role (TEXT)                                │
│ created_at (TIMESTAMP WITH TZ)             │
│ updated_at (TIMESTAMP WITH TZ)             │
├────────────────────────────────────────────┤
│ Indexes:                                   │
│ • idx_user_profiles_email                  │
│ • idx_user_profiles_membership_id          │
├────────────────────────────────────────────┤
│ RLS Policies:                              │
│ ✓ Users can view own profile               │
│ ✓ Users can update own profile             │
│ ✓ Service role can manage all              │
├────────────────────────────────────────────┤
│ Triggers:                                  │
│ ✓ Auto-update updated_at on change         │
└────────────────────────────────────────────┘
```

### **Relationship**
```
auth.users (1) ──── (1) user_profiles
     id                      id
                          (FK to auth.users.id)

When user signs up:
1. Row added to auth.users
2. Row added to user_profiles (same ID)
3. Linked by UUID

When user deletes account:
DELETE CASCADE → user_profiles deleted too
```

---

## Component Hierarchy

```
App
│
├─ AuthProvider (lib/auth/AuthContext.tsx)
│  └─ Provides useAuth() hook to all children
│
├─ Welcome Page (/welcome)
│  │
│  ├─ AuthModal (for login/signup)
│  │  └─ Uses useAuth() for signUp/signIn
│  │
│  └─ Other UI elements
│
├─ Login Page (/login) 
│  └─ Alternate login entry point
│
├─ Dashboard (/member/dashboard)
│  │
│  ├─ Profile Card
│  │  └─ Displays useAuth().userProfile
│  │
│  ├─ Header
│  │  └─ LogoutButton (uses useAuth())
│  │
│  └─ Other dashboard sections
│
└─ Other pages...
```

---

## Data Flow Example: User Signs Up

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User fills signup form                              │
├─────────────────────────────────────────────────────────────┤
│ Email: john@example.com                                     │
│ Password: SecurePass123!                                    │
│ Name: John Doe                                              │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: AuthContext.signUp() called                         │
├─────────────────────────────────────────────────────────────┤
│ await supabase.auth.signUp({                                │
│   email: "john@example.com",                                │
│   password: "SecurePass123!",                               │
│   options: { data: { full_name: "John Doe" } }              │
│ })                                                          │
│                                                             │
│ Returns: { user: { id: "uuid-123", ... } }                 │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Supabase creates auth.users row                     │
├─────────────────────────────────────────────────────────────┤
│ id: "uuid-123"                                              │
│ email: "john@example.com"                                   │
│ encrypted_password: [hashed]                                │
│ created_at: 2026-03-06T...                                  │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: AuthContext creates user_profiles row               │
├─────────────────────────────────────────────────────────────┤
│ INSERT INTO user_profiles VALUES (                          │
│   id: "uuid-123",  ◄─── Same ID as auth.users               │
│   email: "john@example.com",                                │
│   full_name: "John Doe",                                    │
│   membership_package: "Full 48 Package+",                   │
│   membership_id: "M1709736123456",                          │
│   branch: "Malingap Branch",                                │
│   status: "Active",                                         │
│   ... other defaults ...                                    │
│ )                                                           │
│                                                             │
│ RLS Policy checks:                                          │
│ └─ Service role can insert? YES ✓                           │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: AuthContext updates state                           │
├─────────────────────────────────────────────────────────────┤
│ user = {                                                    │
│   id: "uuid-123",                                           │
│   email: "john@example.com",                                │
│   ... more auth data ...                                    │
│ }                                                           │
│                                                             │
│ userProfile = {                                             │
│   id: "uuid-123",                                           │
│   email: "john@example.com",                                │
│   full_name: "John Doe",                                    │
│   membership_package: "Full 48 Package+",                   │
│   membership_id: "M1709736123456",                          │
│   ... all other fields ...                                  │
│ }                                                           │
│                                                             │
│ loading = false                                             │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Session cookie created                              │
├─────────────────────────────────────────────────────────────┤
│ HttpOnly Cookie: [JWT token]                                │
│ Secure: true                                                │
│ SameSite: Lax                                               │
│ Expires: [30 days]                                          │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 7: Component re-renders                                │
├─────────────────────────────────────────────────────────────┤
│ AuthModal detects user is now logged in                     │
│ Closes modal automatically                                  │
│ Redirects to /member/dashboard                              │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 8: Dashboard renders with real data                    │
├─────────────────────────────────────────────────────────────┤
│ <h2>{userProfile.full_name}</h2>  ──► "John Doe"            │
│ <p>{userProfile.membership_id}</p> ──► "M1709736123456"     │
│ <p>{userProfile.branch}</p>        ──► "Malingap Branch"    │
│ <p>{userProfile.status}</p>        ──► "Active"             │
│ Sessions: {userProfile.sessions_completed}/{userProfile...} │
│ ──► "40/48"                                                 │
│                                                             │
│ Profile card shows:                                         │
│ ✓ User's actual data                                        │
│ ✓ Membership details                                        │
│ ✓ Fitness stats                                             │
│ ✓ Badges                                                    │
│ ✓ All real, not mock ✓                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Implementation

### **Password Security**
```
User enters password → Supabase hashes with bcrypt → 
Only hash stored in DB → Never transmitted in clear
```

### **Session Security**
```
HttpOnly Cookie ✓ (can't be accessed by JavaScript)
Secure flag ✓ (only sent over HTTPS)
SameSite ✓ (prevents CSRF attacks)
JWT validation ✓ (signed by Supabase)
```

### **Data Privacy (RLS)**
```
User A logs in
└─ Can select: SELECT * FROM user_profiles 
   WHERE id = auth.uid() ✓ (their own data)
└─ Can't select other users' rows ✓
└─ RLS Policy blocks unauthorized access ✓

Service role (admin)
└─ Can access all user data ✓
└─ Used only for backend operations
```

### **Data Validation**
```
Email validation ✓
Password requirements ✓ (Supabase enforces)
Foreign key constraints ✓
Unique constraints ✓
CHECK constraints ✓ (status only 'Active'/'Inactive')
```

---

## State Management

### **AuthContext State**
```typescript
interface AuthContextType {
  user: User | null;           // From auth.users
  userProfile: UserProfile | null;  // From user_profiles
  loading: boolean;             // Loading state
  signUp: (email, password, name) => Promise<void>;
  signIn: (email, password) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### **Flow**
```
Component uses useAuth()
     │
     ├─ Accesses user: User | null
     ├─ Accesses userProfile: UserProfile | null  
     ├─ Accesses loading: boolean
     │
     └─ Can call:
        ├─ signUp()
        ├─ signIn()
        └─ signOut()

When user changes:
     │
     ├─ AuthContext subscribed to supabase.auth.onAuthStateChange()
     ├─ Updates user state
     ├─ Fetches fresh userProfile
     │
     └─ All components using useAuth() re-render
        └─ Show updated data
```

---

## Error Handling

```
User action (signup/signin/logout)
     │
     try {
       └─ Execute auth operation
          └─ Handle response
     } catch (error) {
       └─ Toast.error(error.message)
       └─ Set loading = false
       └─ User sees friendly message
     }
```

---

**Total System: Secure, scalable, production-ready!**
