# @gym/auth

Complete authentication utilities dengan role-based access control (RBAC).

## Features

- ✅ Login/Register/Logout functions
- ✅ Protected route HOC & components
- ✅ Session management dengan auto-refresh
- ✅ Role-Based Access Control (RBAC)
- ✅ Auth Context Provider (React)
- ✅ Next.js middleware support

## Installation

```bash
pnpm add @gym/auth
```

## Usage

### Setup Auth Provider

```tsx
import { AuthProvider } from '@gym/auth'
import { createDatabaseClient } from '@gym/database'

const supabase = createDatabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function App({ children }) {
  return (
    <AuthProvider supabase={supabase}>
      {children}
    </AuthProvider>
  )
}
```

### Use Auth Hook

```tsx
import { useAuth } from '@gym/auth'

export function Profile() {
  const { user, profile, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <h1>Hello, {profile?.full_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Login & Register

```tsx
import { useAuth } from '@gym/auth'

export function LoginForm() {
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return <button onClick={handleLogin}>Login</button>
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@gym/auth'

export function AdminPage() {
  return (
    <ProtectedRoute allowedRoles="admin">
      <div>Admin Only Content</div>
    </ProtectedRoute>
  )
}
```

### Role Guards

```tsx
import { RoleGuard, PermissionGuard } from '@gym/auth'

export function Dashboard() {
  return (
    <div>
      <RoleGuard allowedRoles={['admin', 'trainer']}>
        <AdminPanel />
      </RoleGuard>

      <PermissionGuard permission="classes.create">
        <CreateClassButton />
      </PermissionGuard>
    </div>
  )
}
```

### Next.js Middleware

```typescript
// middleware.ts
import { createAuthMiddleware, defaultMiddlewareConfig } from '@gym/auth'

export const middleware = createAuthMiddleware({
  ...defaultMiddlewareConfig,
  protectedRoutes: [
    { path: '/admin', allowedRoles: ['admin'] },
    { path: '/trainer', allowedRoles: ['trainer', 'admin'] },
  ]
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## RBAC (Role-Based Access Control)

### Check Permissions

```tsx
import { useAuth } from '@gym/auth'

export function Component() {
  const { hasRole, hasPermission } = useAuth()

  if (hasRole('admin')) {
    // Admin only
  }

  if (hasPermission('classes.create')) {
    // User can create classes
  }
}
```

### Default Permissions

- **Member**: classes.view, classes.book, bookings.view, profile.edit
- **Trainer**: All member permissions + classes.manage, attendance.checkin
- **Admin**: All permissions

## API Reference

### Hooks

- `useAuth()` - Main auth hook
- `useRequireAuth()` - Redirect if not authenticated
- `useRequireRole(roles)` - Redirect if role not allowed

### Components

- `<AuthProvider>` - Context provider
- `<ProtectedRoute>` - Protected route wrapper
- `<RoleGuard>` - Conditional render by role
- `<PermissionGuard>` - Conditional render by permission

### Functions

- `createAuthClient()` - Create auth client
- `createAuthService()` - Create auth service
- `createRBACHelper()` - Create RBAC helper
