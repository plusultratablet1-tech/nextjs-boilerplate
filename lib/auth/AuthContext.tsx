'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'Member' | 'Staff' | 'Leads' | 'Admin';
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
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'Member' | 'Staff' | 'Leads' | 'Admin') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const authInitializedRef = React.useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Only check auth once on mount
    const initializeAuth = async () => {
      if (authInitializedRef.current) return;
      authInitializedRef.current = true;

      try {
        // Use onAuthStateChange instead of getSession to avoid lock conflicts
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return;

            if (session?.user) {
              setUser(session.user);
              // Only fetch profile for relevant events
              if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
                await fetchUserProfile(session.user.id);
              }
            } else {
              setUser(null);
              setUserProfile(null);
            }

            // Mark loading as complete after first event
            if (isMounted) {
              setLoading(false);
            }
          }
        );

        return authListener;
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const authListenerPromise = initializeAuth();

    return () => {
      isMounted = false;
      // Cleanup listener
      authListenerPromise.then((listener) => {
        listener?.subscription?.unsubscribe();
      }).catch(() => {
        // Ignore cleanup errors
      });
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
        // Silently handle errors - user_profiles table may not exist yet
        if (error.code !== 'PGRST116') {
          console.warn('Profile fetch warning:', error.message);
        }
        setUserProfile(null);
        return;
      }

      setUserProfile(data as UserProfile || null);
    } catch (error: any) {
      // Ignore AbortError and other request errors
      if (error?.name !== 'AbortError') {
        console.error('Error fetching user profile:', error);
      }
      setUserProfile(null);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'Member' | 'Staff' | 'Leads' | 'Admin' = 'Member') => {
    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed');

      // Create user profile with role
      const profileData: any = {
        id: authData.user.id,
        email,
        full_name: fullName,
        role: role,
        status: 'Active',
      };

      // Set role-specific defaults
      if (role === 'Member') {
        profileData.membership_package = 'Full 48 Package+';
        profileData.membership_id = `M${Date.now()}`;
        profileData.branch = 'Malingap Branch';
        profileData.workout_streak = 0;
        profileData.bearforce_points = 0;
        profileData.prestige_member_season = 'Season 1';
        profileData.fitness_level = 'Beginner';
        profileData.sessions_completed = 0;
        profileData.sessions_total = 48;
        profileData.badges = [];
      } else if (role === 'Staff') {
        profileData.branch = 'Malingap Branch';
        profileData.position = 'Coach';
        profileData.clients_assigned = 0;
        profileData.total_sessions_conducted = 0;
      } else if (role === 'Leads') {
        profileData.lead_source = 'Walk-in';
        profileData.status_type = 'New';
        profileData.follow_up_date = null;
      } else if (role === 'Admin') {
        profileData.branch = 'Main';
        profileData.permissions = [];
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([profileData]);

      // Log but don't throw - user_profiles table may not exist yet
      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Profile creation warning:', profileError.message);
      }

      // Don't await profile fetch - let the auth listener handle it
      setUser(authData.user);
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

      // Let the auth listener handle profile fetching
      setUser(data.user);
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
