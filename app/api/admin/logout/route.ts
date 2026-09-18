import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/auth/admin-session'

export async function POST() {
  return NextResponse.json({ ok: true }, {
    headers: { 'Set-Cookie': clearAdminSessionCookie() },
  })
}
