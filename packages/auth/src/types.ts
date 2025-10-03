import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { Tables } from '@gym/database'

export type UserRole = 'member' | 'trainer' | 'admin'

export interface AuthUser extends SupabaseUser {
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export interface UserProfile extends Tables<'users'> {
  role: UserRole
}

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
  phone?: string
  role?: UserRole
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string) => boolean
}

export interface RolePermissions {
  member: string[]
  trainer: string[]
  admin: string[]
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS: RolePermissions = {
  member: [
    'classes.view',
    'classes.book',
    'bookings.view',
    'bookings.cancel',
    'profile.view',
    'profile.edit',
    'membership.view',
    'notifications.view',
  ],
  trainer: [
    'classes.view',
    'classes.manage',
    'schedules.view',
    'schedules.manage',
    'bookings.view',
    'attendance.view',
    'attendance.checkin',
    'profile.view',
    'profile.edit',
    'members.view',
  ],
  admin: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'classes.view',
    'classes.create',
    'classes.edit',
    'classes.delete',
    'trainers.view',
    'trainers.manage',
    'members.view',
    'members.manage',
    'bookings.view',
    'bookings.manage',
    'payments.view',
    'payments.manage',
    'equipment.view',
    'equipment.manage',
    'analytics.view',
    'settings.manage',
  ],
}
