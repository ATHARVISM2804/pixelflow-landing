import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/admin',
  '/profile',
  '/cards',
  '/id-card',
  '/passport-photo',
  '/aadhaar',
  '/voter',
  '/resume',
  '/kundli',
  '/editor',
  '/page-maker',
  '/add-money',
  '/card',
  '/did',
  '/abha',
  '/uan',
  '/apaar',
  '/voter-slip',
  '/impds-ration',
  '/driving-license',
  '/aepds-ration',
  '/complete-profile',
  '/remove-bg'
]

// Add paths that should redirect authenticated users
const authPaths = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Check if it's an auth page
  const isAuthPath = authPaths.includes(pathname)
  
  // You would typically check for auth token here
  // For now, we'll pass through all requests
  // In a real app, you'd check cookies/headers for authentication
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}