'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  membership_package: string;
  membership_id: string;
  branch: string;
  status: string;
  profile_image_url: string | null;
  workout_streak: number;
  bearforce_points: number;
  prestige_member_season: string;
  fitness_level: string;
  sessions_completed: number;
  sessions_total: number;
  badges: string[];
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // PGRST116 = row not found, other errors might mean table doesn't exist
      if (error) {
        console.warn('Profile fetch warning:', error.message);
        setUserProfile(null);
        return;
      }

      setUserProfile(data as UserProfile || null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed');

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            membership_package: 'Full 48 Package+',
            membership_id: `M${Date.now()}`,
            branch: 'Malingap Branch',
            status: 'Active',
            role: 'Member',
          },
        ]);

      // Log but don't throw - user_profiles table may not exist yet
      if (profileError) {
        console.warn('Profile creation warning:', profileError);
      }

      setUser(authData.user);
      await fetchUserProfile(authData.user.id);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Sign in failed');

      setUser(data.user);
      await fetchUserProfile(data.user.id);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
