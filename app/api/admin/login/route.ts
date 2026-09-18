import { NextResponse } from 'next/server'
import { adminSessionCookie, createAdminSession, isAdminAuthConfigured, verifyAdminPassword } from '@/lib/auth/admin-session'

export async function POST(request: Request) {
  if (!isAdminAuthConfigured())
    return NextResponse.json({ message: '管理后台尚未配置，请联系管理员' }, { status: 503 })

  const { password } = await request.json().catch(() => ({ password: '' }))
  if (!verifyAdminPassword(String(password || '')))
    return NextResponse.json({ message: '管理口令不正确' }, { status: 401 })

  return NextResponse.json({ ok: true }, {
    headers: { 'Set-Cookie': adminSessionCookie(await createAdminSession()) },
  })
}
