'use client'

import React from 'react'
import { useAuth } from './context'
import type { UserRole } from './types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole | UserRole[]
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * Protected Route Component (HOC pattern)
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallback,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasRole } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    return null
  }

  // Check role permissions
  if (allowedRoles && !hasRole(allowedRoles)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized'
    }
    return null
  }

  return <>{children}</>
}

/**
 * Higher-Order Component to protect routes
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    allowedRoles?: UserRole | UserRole[]
    redirectTo?: string
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute allowedRoles={options?.allowedRoles} redirectTo={options?.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

/**
 * Component to show content only for specific roles
 */
interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Component to show content only if user has permission
 */
interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
