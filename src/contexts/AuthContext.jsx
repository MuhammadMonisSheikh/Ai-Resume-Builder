// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as supabaseAuth from '../services/supabaseAuthService';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch user profile from Supabase profiles table
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('Exception fetching profile:', err);
      setProfile(null);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!user?.id) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error('Exception updating profile:', err);
      return { success: false, error: err.message };
    }
  }, [user?.id]);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe;
    const getUser = async () => {
      try {
        setLoading(true);
        const user = await supabaseAuth.getCurrentUser();
        setUser(user);
        if (user) {
          console.log('User authenticated:', user);
          await fetchUserProfile(user.id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error getting current user:', err);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };
    getUser();
    
    const { data: listener } = supabaseAuth.onAuthChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    
    unsubscribe = listener?.subscription?.unsubscribe;
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchUserProfile]);

  // Auth actions
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await supabaseAuth.signIn(email, password);
      setUser(user);
      await fetchUserProfile(user.id);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const signup = useCallback(async (email, password, full_name = '') => {
    setLoading(true);
    setError(null);
    try {
      const user = await supabaseAuth.signUp(email, password, { full_name });
      setUser(user);
      // Profile will be automatically created by the database trigger
      await fetchUserProfile(user.id);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await supabaseAuth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user display name
  const getUserDisplayName = useCallback(() => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [profile, user]);

  // Get user initials
  const getUserInitials = useCallback(() => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }, [profile, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      error, 
      login, 
      signup, 
      logout, 
      updateProfile,
      getUserDisplayName,
      getUserInitials,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 