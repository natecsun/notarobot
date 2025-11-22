import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// List of bad bots to block instantly
const BAD_BOTS = [
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'Bytespider',
];

export async function middleware(request: NextRequest) {
  // --- 1. Security Checks ---
  const userAgent = request.headers.get('user-agent') || '';

  // Block Bad Bots
  for (const bot of BAD_BOTS) {
    if (userAgent.includes(bot)) {
      return new NextResponse('Access Denied: Bot Detected', { status: 403 });
    }
  }

  // Basic Path Security
  const path = request.nextUrl.pathname;
  if (path.includes('.env') || path.includes('wp-admin') || path.includes('.git')) {
     return new NextResponse('Access Denied', { status: 403 });
  }

  // --- 2. Supabase Session Handling ---
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
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

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: '/:path*',
};
