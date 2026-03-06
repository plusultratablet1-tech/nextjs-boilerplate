import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (pathname === '/' || pathname === '/welcome' || pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  try {
    // Get session from cookies (Supabase sets these automatically)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next()
    }

    // For dashboard routes, check auth and redirect to role-specific dashboard
    if (pathname.includes('/dashboard')) {
      // This is handled by the app itself since we need to read userProfile from context
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('[v0] Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
