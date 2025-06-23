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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe;
    const getUser = async () => {
      try {
        setLoading(true);
        const user = await supabaseAuth.getCurrentUser();
        setUser(user);
        if (user) await fetchUserProfile(user.id);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };
    getUser();
    const { data: listener } = supabaseAuth.onAuthChange((event, session) => {
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
      const user = await supabaseAuth.signUp(email, password);
      setUser(user);
      // Insert user profile into profiles table
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name, avatar_url: '', bio: '' }]);
      if (error) throw error;
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

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}; 