import { createBrowserClient } from '@supabase/ssr'
import type { Database, SupabaseClient } from '@gym/database'
import type { LoginCredentials, RegisterCredentials, UserProfile, AuthUser } from './types'

/**
 * Authentication functions for client-side usage
 */
export class AuthClient {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Login with email and password
   */
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new AuthError(error.message)
    return data
  }

  /**
   * Register a new user
   */
  async register({ email, password, fullName, phone, role = 'member' }: RegisterCredentials) {
    // Create auth user
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) throw new AuthError(authError.message)
    if (!authData.user) throw new AuthError('Failed to create user')

    // Create user profile
    const { error: profileError } = await this.supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      phone: phone || null,
      role,
    } as any)

    if (profileError) throw new AuthError(profileError.message)

    return authData
  }

  /**
   * Logout current user
   */
  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw new AuthError(error.message)
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession()
    if (error) throw new AuthError(error.message)
    return data.session
  }

  /**
   * Get current user
   */
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser()
    if (error) throw new AuthError(error.message)
    return data.user as AuthUser | null
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new AuthError(error.message)
    }

    return data
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    // @ts-ignore - Supabase type inference issue
    const { data, error } = await this.supabase
      .from('users')
      // @ts-ignore
      .update(updates as any)
      // @ts-ignore
      .eq('id', userId)
      .select()
      .single()

    if (error) throw new AuthError(error.message)
    return data
  }

  /**
   * Refresh session
   */
  async refreshSession() {
    const { data, error } = await this.supabase.auth.refreshSession()
    if (error) throw new AuthError(error.message)
    return data.session
  }

  /**
   * Reset password request
   */
  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw new AuthError(error.message)
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw new AuthError(error.message)
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

/**
 * Custom Auth Error class
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Create browser-based Supabase client
 */
export function createAuthClient(supabaseUrl: string, supabaseKey: string) {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

/**
 * Create auth client instance with auth methods
 */
export function createAuthService(supabase: SupabaseClient) {
  return new AuthClient(supabase)
}
