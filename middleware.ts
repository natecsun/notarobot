import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of bad bots to block instantly
const BAD_BOTS = [
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'Bytespider',
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Block Bad Bots
  for (const bot of BAD_BOTS) {
    if (userAgent.includes(bot)) {
      return new NextResponse('Access Denied: Bot Detected', { status: 403 });
    }
  }

  // 2. Basic Path Security (Block attempts to access .env or similar)
  const path = request.nextUrl.pathname;
  if (path.includes('.env') || path.includes('wp-admin') || path.includes('.git')) {
     return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
