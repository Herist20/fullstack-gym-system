import type { UserRole, RolePermissions } from './types'
import { DEFAULT_PERMISSIONS } from './types'

/**
 * Role-Based Access Control (RBAC) Helper
 */
export class RBACHelper {
  constructor(private permissions: RolePermissions = DEFAULT_PERMISSIONS) {}

  /**
   * Check if a role has a specific permission
   */
  hasPermission(role: UserRole, permission: string): boolean {
    const rolePermissions = this.permissions[role]
    return rolePermissions.includes(permission)
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(userRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    return roles.includes(userRole)
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(role: UserRole, permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(role, permission))
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(role: UserRole, permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(role, permission))
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: UserRole): string[] {
    return this.permissions[role]
  }

  /**
   * Check if role can access a resource
   */
  canAccess(role: UserRole, resource: string, action: string): boolean {
    const permission = `${resource}.${action}`
    return this.hasPermission(role, permission)
  }
}

/**
 * Create RBAC helper instance
 */
export function createRBACHelper(permissions?: RolePermissions) {
  return new RBACHelper(permissions)
}

/**
 * Higher-order function to protect routes based on role
 */
export function requireRole(_allowedRoles: UserRole | UserRole[]) {
  return function <T extends (...args: any[]) => any>(
    target: T,
    _context: ClassMethodDecoratorContext
  ) {
    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
      // This would be used with a class method that has access to user role
      // Implementation would depend on the framework (Next.js, Express, etc.)
      return target.apply(this, args)
    }
  }
}

/**
 * Check permissions utility
 */
export function checkPermissions(
  userRole: UserRole,
  requiredPermissions: string | string[]
): boolean {
  const rbac = createRBACHelper()
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  return rbac.hasAllPermissions(userRole, permissions)
}

/**
 * Role hierarchy helper
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  member: 1,
  trainer: 2,
  admin: 3,
}

/**
 * Check if role has higher or equal privilege
 */
export function hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
