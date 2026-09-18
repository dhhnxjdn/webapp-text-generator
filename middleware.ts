import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/auth/admin-session'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login'
  if (isLogin)
    return NextResponse.next()

  const authenticated = await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
  if (authenticated)
    return NextResponse.next()

  if (pathname.startsWith('/api/admin'))
    return NextResponse.json({ message: '未登录或登录已过期' }, { status: 401 })

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
