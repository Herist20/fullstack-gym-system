// Export types
export * from './types'

// Export client utilities
export * from './client'

// Export server utilities
export * from './server'

// Export RBAC utilities
export * from './rbac'

// Export React components and hooks
export * from './context'
export * from './protected'

// Export middleware
export * from './middleware'

// Re-export commonly used items
export { AuthClient, AuthError, createAuthClient, createAuthService } from './client'
export { AuthProvider, useAuth, useRequireAuth, useRequireRole } from './context'
export { ProtectedRoute, withAuth, RoleGuard, PermissionGuard } from './protected'
export { createRBACHelper, checkPermissions, hasHigherOrEqualRole } from './rbac'
export { createAuthMiddleware, defaultMiddlewareConfig } from './middleware'
