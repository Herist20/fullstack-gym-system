import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@gym/database'
import type { UserRole } from './types'

/**
 * Middleware configuration for protected routes
 */
export interface MiddlewareConfig {
  publicRoutes?: string[]
  authRoutes?: string[]
  protectedRoutes?: {
    path: string
    allowedRoles?: UserRole[]
  }[]
  redirects?: {
    afterLogin?: string
    afterLogout?: string
    unauthorized?: string
  }
}

/**
 * Create auth middleware for Next.js
 */
export function createAuthMiddleware(config: MiddlewareConfig = {}) {
  const {
    publicRoutes = ['/'],
    authRoutes = ['/auth/login', '/auth/register'],
    protectedRoutes = [],
    redirects = {
      afterLogin: '/dashboard',
      afterLogout: '/auth/login',
      unauthorized: '/unauthorized',
    },
  } = config

  return async function middleware(request: NextRequest) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const pathname = request.nextUrl.pathname

    // Check if route is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname === route || pathname.startsWith(route + '/')
    )

    // Check if route is auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL(redirects.afterLogin!, request.url))
    }

    // If route is public, allow access
    if (isPublicRoute) {
      return response
    }

    // If user is not authenticated and route is not public, redirect to login
    if (!session && !isAuthRoute) {
      const redirectUrl = new URL(redirects.afterLogout!, request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check role-based access for protected routes
    if (session) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      for (const route of protectedRoutes) {
        if (pathname.startsWith(route.path)) {
          if (route.allowedRoles && profile) {
            const userRole = profile.role as UserRole

            if (!route.allowedRoles.includes(userRole)) {
              return NextResponse.redirect(new URL(redirects.unauthorized!, request.url))
            }
          }
        }
      }
    }

    return response
  }
}

/**
 * Default middleware config for common use cases
 */
export const defaultMiddlewareConfig: MiddlewareConfig = {
  publicRoutes: ['/', '/about', '/contact'],
  authRoutes: ['/auth/login', '/auth/register', '/auth/reset-password'],
  protectedRoutes: [
    {
      path: '/admin',
      allowedRoles: ['admin'],
    },
    {
      path: '/trainer',
      allowedRoles: ['trainer', 'admin'],
    },
    {
      path: '/member',
      allowedRoles: ['member', 'trainer', 'admin'],
    },
  ],
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    unauthorized: '/unauthorized',
  },
}
