'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { AdminWorkflow, ResultMode, WorkflowInput, WorkflowType } from '@/types/workflow'

const emptyForm: WorkflowInput = {
  slug: '',
  name: '',
  icon: 'sparkles',
  description: '',
  appId: '',
  apiUrl: 'https://api.dify.ai/v1',
  apiKey: '',
  type: 'workflow',
  resultMode: 'auto',
  enabled: true,
  order: 0,
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
    </div>
    <div className="mt-2">{children}</div>
  </label>
)

const inputClass = 'h-11 w-full rounded-xl border border-black/10 bg-gray-50 px-3.5 text-sm outline-none transition focus:border-[#17191e] focus:bg-white focus:ring-4 focus:ring-black/[0.04] disabled:cursor-not-allowed disabled:text-gray-400'

const AdminPage = () => {
  const router = useRouter()
  const [items, setItems] = useState<AdminWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<WorkflowInput>(emptyForm)
  const [showKey, setShowKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const editing = useMemo(() => items.find(item => item.slug === editingSlug), [items, editingSlug])

  const load = useCallback(async () => {
    setLoading(true)
    const response = await fetch('/api/admin/workflows', { cache: 'no-store' })
    if (response.status === 401) {
      router.replace('/admin/login')
      return
    }
    const data = await response.json().catch(() => [])
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditingSlug(null)
    setForm({ ...emptyForm, order: items.length })
    setMessage(null)
    setFormOpen(true)
  }

  const openEdit = (item: AdminWorkflow) => {
    setEditingSlug(item.slug)
    setForm({
      slug: item.slug,
      name: item.name,
      icon: item.icon,
      description: item.description,
      appId: item.appId || '',
      apiUrl: item.apiUrl || 'https://api.dify.ai/v1',
      apiKey: '',
      type: item.type,
      resultMode: item.resultMode,
      enabled: item.enabled,
      order: item.order,
      revision: item.revision,
    })
    setMessage(null)
    setFormOpen(true)
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    const response = await fetch(editingSlug ? `/api/admin/workflows/${editingSlug}` : '/api/admin/workflows', {
      method: editingSlug ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await response.json().catch(() => ({}))
    setSaving(false)
    if (!response.ok) {
      setMessage({ type: 'error', text: data.message || '保存失败' })
      return
    }
    setMessage({ type: 'success', text: '连接验证成功，工作流已保存。' })
    await load()
    setTimeout(() => setFormOpen(false), 650)
  }

  const remove = async (item: AdminWorkflow) => {
    // The browser confirmation protects against accidental destructive clicks.
    // eslint-disable-next-line no-alert
    if (!window.confirm(`确定删除“${item.name}”吗？这个操作无法撤销。`))
      return
    const response = await fetch(`/api/admin/workflows/${item.slug}`, { method: 'DELETE' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage({ type: 'error', text: data.message || '删除失败' })
      return
    }
    await load()
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#16181d]">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17191e] text-white">鲤</div>
            <div>
              <div className="text-sm font-semibold tracking-[0.08em]">大鲤传媒</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400">Workflow Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-50">查看前台</a>
            <button onClick={logout} className="rounded-lg border border-black/10 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50">退出</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fe2c55]">Registry</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">工作流管理</h1>
            <p className="mt-2 text-sm text-gray-500">新增后无需重新部署，工作流会立即出现在平台首页。</p>
          </div>
          <button onClick={openCreate} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17191e] px-4 text-sm font-medium text-white transition hover:bg-black">
            <PlusIcon className="h-4 w-4" />新增工作流
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          {loading && <div className="p-10 text-center text-sm text-gray-400">正在加载注册表…</div>}
          {!loading && items.length === 0 && <div className="p-12 text-center text-sm text-gray-500">还没有工作流，点击右上角开始添加。</div>}
          {!loading && items.map((item, index) => (
            <div key={item.slug} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${index > 0 ? 'border-t border-black/[0.06]' : ''}`}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17191e] text-sm text-white">{item.name.slice(0, 1)}</div>
              <div className="min-w-0 grow">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{item.name}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${item.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.enabled ? '已启用' : '已停用'}</span>
                  {item.apiKeyConfigured && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">密钥已加密</span>}
                </div>
                <div className="mt-1 truncate text-xs text-gray-400">/{item.slug} · {item.type} · {item.resultMode}</div>
                {item.description && <p className="mt-2 line-clamp-1 text-sm text-gray-500">{item.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {item.enabled && <a href={`/w/${item.slug}`} target="_blank" className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700" title="打开"><ArrowTopRightOnSquareIcon className="h-4 w-4" /></a>}
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700" title="编辑"><PencilSquareIcon className="h-4 w-4" /></button>
                <button onClick={() => remove(item)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600" title="删除"><TrashIcon className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]" onMouseDown={event => event.target === event.currentTarget && setFormOpen(false)}>
          <div className="h-full w-full max-w-[560px] overflow-y-auto bg-white shadow-2xl">
            <form onSubmit={save}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.06] bg-white/95 px-6 py-5 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold">{editingSlug ? '编辑工作流' : '新增工作流'}</h2>
                  <p className="mt-1 text-xs text-gray-400">保存前会自动验证 Dify 连接。</p>
                </div>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">关闭</button>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="工作流名称"><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="例如：抖音数据检测" /></Field></div>
                <Field label="Slug" hint="保存后不可修改"><input required disabled={Boolean(editingSlug)} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} className={inputClass} placeholder="douyin-check" /></Field>
                <Field label="排序"><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} /></Field>
                <div className="sm:col-span-2"><Field label="简介"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} h-24 resize-none py-3`} placeholder="告诉用户这个工作流能解决什么问题" /></Field></div>
                <Field label="图标"><select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className={inputClass}><option value="sparkles">智能工具</option><option value="chart">数据分析</option><option value="document">文档内容</option><option value="bolt">效率工具</option></select></Field>
                <Field label="应用类型"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as WorkflowType })} className={inputClass}><option value="workflow">Workflow</option><option value="completion">文本生成</option></select></Field>
                <Field label="结果展示"><select value={form.resultMode} onChange={e => setForm({ ...form, resultMode: e.target.value as ResultMode })} className={inputClass}><option value="auto">自动识别</option><option value="markdown">Markdown</option><option value="json">JSON</option><option value="metrics">指标卡</option><option value="table">表格</option></select></Field>
                <Field label="状态"><select value={form.enabled ? 'true' : 'false'} onChange={e => setForm({ ...form, enabled: e.target.value === 'true' })} className={inputClass}><option value="true">启用</option><option value="false">停用</option></select></Field>
                <div className="sm:col-span-2"><div className="my-1 h-px bg-black/[0.06]" /></div>
                <div className="sm:col-span-2"><Field label="Dify API 地址"><input required value={form.apiUrl} onChange={e => setForm({ ...form, apiUrl: e.target.value })} className={inputClass} placeholder="https://api.dify.ai/v1" /></Field></div>
                <div className="sm:col-span-2"><Field label="App ID" hint="用于管理识别，可选"><input value={form.appId} onChange={e => setForm({ ...form, appId: e.target.value })} className={inputClass} placeholder="Dify 应用 ID" /></Field></div>
                <div className="sm:col-span-2">
                  <Field label="API Key" hint={editing ? '留空表示保留现有密钥' : '仅在服务端加密保存'}>
                    <div className="relative">
                      <input required={!editingSlug} type={showKey ? 'text' : 'password'} value={form.apiKey} onChange={e => setForm({ ...form, apiKey: e.target.value })} className={`${inputClass} pr-11`} placeholder={editingSlug ? '••••••••••••（留空不修改）' : 'app-...'} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowKey(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showKey ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}</button>
                    </div>
                  </Field>
                </div>
              </div>

              {message && <div className={`mx-6 mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-xs ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.type === 'success' && <CheckCircleIcon className="h-4 w-4" />}{message.text}</div>}

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-black/[0.06] bg-white/95 px-6 py-4 backdrop-blur">
                <button type="button" onClick={() => setFormOpen(false)} className="h-11 rounded-xl border border-black/10 px-4 text-sm text-gray-600">取消</button>
                <button disabled={saving} className="h-11 rounded-xl bg-[#17191e] px-5 text-sm font-medium text-white disabled:opacity-50">{saving ? '正在验证并保存…' : '验证并保存'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPage
