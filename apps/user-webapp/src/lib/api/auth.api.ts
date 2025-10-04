import { createClient } from '@/lib/supabase/client';
import type { LoginInput, RegisterInput, ForgotPasswordInput, UpdateProfileInput, ChangePasswordInput } from '@/lib/schemas/auth.schema';

export const authApi = {
  async login(data: LoginInput) {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return authData;
  },

  async register(data: RegisterInput) {
    const supabase = createClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
        },
      },
    });

    if (signUpError) throw signUpError;

    // Create user profile in users table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          role: 'member',
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  async forgotPassword(data: ForgotPasswordInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  async resetPassword(password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  },

  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return null;

    // Try to get profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          phone_number: user.user_metadata?.phone_number || null,
          role: 'member',
        });

      if (createError) {
        console.error('Error creating user profile:', createError);
        // Return basic user info even if profile creation fails
        return {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          phoneNumber: user.user_metadata?.phone_number || undefined,
          avatarUrl: undefined,
        };
      }

      // Fetch the newly created profile
      const { data: newProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (newProfile) {
        return {
          id: user.id,
          email: user.email!,
          fullName: newProfile.full_name,
          phoneNumber: newProfile.phone_number,
          avatarUrl: newProfile.avatar_url,
        };
      }
    }

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    return {
      id: user.id,
      email: user.email!,
      fullName: profile.full_name,
      phoneNumber: profile.phone_number,
      avatarUrl: profile.avatar_url,
    };
  },

  async updateProfile(data: UpdateProfileInput) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('users')
      .update({
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        date_of_birth: data.dateOfBirth,
        address: data.address,
        emergency_contact: data.emergencyContact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;
  },

  async changePassword(data: ChangePasswordInput) {
    const supabase = createClient();

    // Verify current password by attempting to sign in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error('Not authenticated');

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: data.currentPassword,
    });

    if (verifyError) throw new Error('Current password is incorrect');

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw error;
  },

  async uploadAvatar(file: File) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return publicUrl;
  },
};
