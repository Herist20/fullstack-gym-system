import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated, check admin/trainer role
  if (user) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    // If not an admin or trainer, redirect to unauthorized page
    if (!adminUser && request.nextUrl.pathname !== '/unauthorized') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // Redirect trainers to their dashboard
    if (adminUser?.role === 'trainer' && !request.nextUrl.pathname.startsWith('/trainer')) {
      const url = request.nextUrl.clone();
      url.pathname = '/trainer';
      return NextResponse.redirect(url);
    }

    // Redirect admins away from trainer routes
    if (adminUser?.role === 'admin' && request.nextUrl.pathname.startsWith('/trainer')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = adminUser?.role === 'trainer' ? '/trainer' : '/';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
