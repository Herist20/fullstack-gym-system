'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { SupabaseClient } from '@gym/database'
import type {
  AuthContextValue,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from './types'
import { AuthClient } from './client'
import { createRBACHelper } from './rbac'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  supabase: SupabaseClient
}

/**
 * Auth Context Provider Component
 */
export function AuthProvider({ children, supabase }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const authClient = new AuthClient(supabase)
  const rbac = createRBACHelper()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authClient.getSession()

        if (session?.user) {
          const profile = await authClient.getUserProfile(session.user.id)

          setState({
            user: session.user as any,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    initAuth()

    // Listen to auth changes
    const { data: { subscription } } = authClient.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await authClient.getUserProfile(session.user.id)

          setState({
            user: session.user as any,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState((prev) => ({
            ...prev,
            session,
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { session, user } = await authClient.login(credentials)

      if (user) {
        const profile = await authClient.getUserProfile(user.id)

        setState({
          user: user as any,
          profile,
          session,
          isLoading: false,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { session, user } = await authClient.register(credentials)

      if (user) {
        const profile = await authClient.getUserProfile(user.id)

        setState({
          user: user as any,
          profile,
          session,
          isLoading: false,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      await authClient.logout()

      setState({
        user: null,
        profile: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      const session = await authClient.refreshSession()

      setState((prev) => ({
        ...prev,
        session,
      }))
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }, [])

  // Check if user has role
  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!state.profile) return false
      return rbac.hasRole(state.profile.role, role)
    },
    [state.profile]
  )

  // Check if user has permission
  const hasPermission = useCallback(
    (permission: string) => {
      if (!state.profile) return false
      return rbac.hasPermission(state.profile.role, permission)
    },
    [state.profile]
  )

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshSession,
    hasRole,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

/**
 * Hook to require authentication
 */
export function useRequireAuth() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login or show error
      window.location.href = '/auth/login'
    }
  }, [auth.isLoading, auth.isAuthenticated])

  return auth
}

/**
 * Hook to require specific role
 */
export function useRequireRole(allowedRoles: UserRole | UserRole[]) {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && !auth.hasRole(allowedRoles)) {
      // Redirect to unauthorized page
      window.location.href = '/unauthorized'
    }
  }, [auth.isLoading, auth.isAuthenticated, allowedRoles])

  return auth
}
