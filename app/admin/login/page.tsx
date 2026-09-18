'use client'

import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const AdminLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: value }),
    })
    const data = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) {
      setError(data.message || '登录失败')
      return
    }
    const nextPath = searchParams.get('next')
    let destination = '/admin'
    if (nextPath?.startsWith('/admin') && !nextPath.startsWith('//'))
      destination = nextPath
    router.replace(destination)
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7f9] px-5">
      <div className="absolute left-1/2 top-[-220px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,44,85,0.12),rgba(37,244,238,0.06)_42%,transparent_72%)]" />
      <div className="relative w-full max-w-[420px] rounded-3xl border border-black/[0.07] bg-white p-7 shadow-[0_24px_80px_rgba(16,24,40,0.1)] sm:p-9">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17191e] text-lg text-white">鲤</div>
          <div>
            <div className="font-semibold tracking-[0.08em]">大鲤传媒</div>
            <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-gray-400">Workflow Admin</div>
          </div>
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">进入管理后台</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">使用部署环境中配置的管理口令登录。</p>
        <form onSubmit={submit} className="mt-7">
          <label className="text-xs font-medium text-gray-700">管理口令</label>
          <div className="relative mt-2">
            <LockClosedIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-black/10 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#17191e] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
              placeholder="请输入管理口令"
            />
          </div>
          {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
          <button disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17191e] text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? '正在验证…' : '登录管理后台'}
            {!loading && <ArrowRightIcon className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin
