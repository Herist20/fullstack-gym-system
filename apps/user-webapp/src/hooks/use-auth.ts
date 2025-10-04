import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { LoginInput, RegisterInput, ForgotPasswordInput, UpdateProfileInput, ChangePasswordInput } from '@/lib/schemas/auth.schema';

export function useAuth() {
  const { user, setUser, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      toast.success('Login berhasil!');

      // Wait a bit for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force a hard navigation to refresh the session
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login gagal');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registrasi gagal');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Link reset password telah dikirim ke email Anda');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengirim link reset password');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password berhasil diubah!');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengubah password');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      toast.success('Logout berhasil');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout gagal');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal update profile');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password berhasil diubah');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal mengubah password');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: authApi.uploadAvatar,
    onSuccess: () => {
      toast.success('Avatar berhasil diupload');
      queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal upload avatar');
    },
  });

  return {
    user: currentUser || user,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
