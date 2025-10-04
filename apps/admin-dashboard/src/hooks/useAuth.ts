'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AdminUser } from '@/lib/types';

interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  isTrainer: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    adminUser: null,
    loading: true,
    isAdmin: false,
    isTrainer: false,
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          setState({ user: null, adminUser: null, loading: false, isAdmin: false, isTrainer: false });
          return;
        }

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!userProfile) {
          setState({ user: null, adminUser: null, loading: false, isAdmin: false, isTrainer: false });
          return;
        }

        // Fetch admin user data if applicable
        const { data: adminProfile } = await supabase
          .from('admin_users')
          .select('*, user:users(*)')
          .eq('user_id', authUser.id)
          .eq('is_active', true)
          .single();

        setState({
          user: userProfile,
          adminUser: adminProfile || null,
          loading: false,
          isAdmin: adminProfile?.role === 'admin',
          isTrainer: adminProfile?.role === 'trainer',
        });

        // Update last login
        if (adminProfile) {
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminProfile.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setState({ user: null, adminUser: null, loading: false, isAdmin: false, isTrainer: false });
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, adminUser: null, loading: false, isAdmin: false, isTrainer: false });
  };

  return {
    ...state,
    signOut,
  };
}
