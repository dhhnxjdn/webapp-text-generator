import Link from 'next/link'
import { ArrowRightIcon, BoltIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import WorkflowIcon from '@/app/components/platform/workflow-icon'
import { listPublicWorkflows } from '@/lib/registry/registry'

export const dynamic = 'force-dynamic'

const Home = async () => {
  let workflows = [] as Awaited<ReturnType<typeof listPublicWorkflows>>
  let registryReady = true
  try {
    workflows = await listPublicWorkflows()
  }
  catch {
    registryReady = false
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#16181d]">
      <header className="border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17191e] text-lg text-white shadow-sm">鲤</div>
            <div>
              <div className="text-[15px] font-semibold tracking-[0.08em]">大鲤传媒</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">AI Workflow Studio</div>
            </div>
          </Link>
          <Link href="/admin" className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-black/20 hover:bg-gray-50">
            管理工作流
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/[0.05] bg-white">
        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,44,85,0.12),rgba(37,244,238,0.06)_42%,transparent_72%)]" />
        <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm">
            <SparklesIcon className="h-3.5 w-3.5 text-[#fe2c55]" />
            一个入口，连接每一个 Dify 工作流
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#111318] sm:text-6xl">
            把复杂的工作流，变成<br className="hidden sm:block" />人人都会用的工具。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            大鲤传媒工作流平台集中管理数据检测、内容生产和智能处理工具。无需理解流程节点，填写内容即可得到结果。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2"><BoltIcon className="h-4 w-4 text-[#fe2c55]" />动态表单</span>
            <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-2"><ShieldCheckIcon className="h-4 w-4 text-emerald-600" />服务端密钥保护</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fe2c55]">Workflow Library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">工作流广场</h2>
            <p className="mt-2 text-sm text-gray-500">选择一个工具，立即开始处理。</p>
          </div>
          {workflows.length > 0 && <div className="text-xs text-gray-400">共 {workflows.length} 个工具</div>}
        </div>

        {!registryReady && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            工作流存储尚未配置。请先设置 Upstash 环境变量，然后进入管理页添加工作流。
          </div>
        )}

        {registryReady && workflows.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17191e] text-xl text-white">鲤</div>
            <h3 className="mt-5 text-lg font-semibold">准备添加第一个工作流</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">登录管理页，填写 Dify 应用信息。保存后无需重新部署，工具会立即出现在这里。</p>
            <Link href="/admin" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17191e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black">
              前往管理页 <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}

        {workflows.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map(workflow => (
              <Link
                key={workflow.slug}
                href={`/w/${workflow.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)] transition duration-300 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_18px_50px_rgba(16,24,40,0.08)]"
              >
                <div className="absolute right-[-28px] top-[-36px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(254,44,85,0.1),transparent_70%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-start justify-between">
                  <WorkflowIcon name={workflow.icon} />
                  <ArrowRightIcon className="h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#fe2c55]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{workflow.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-[44px] text-sm leading-[22px] text-gray-500">{workflow.description || '打开工作流并填写输入内容。'}</p>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="rounded-full bg-gray-50 px-2.5 py-1">{workflow.type === 'workflow' ? '工作流' : '文本生成'}</span>
                  <span className="rounded-full bg-gray-50 px-2.5 py-1">实时运行</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-black/[0.06] bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} 大鲤传媒</span>
          <span>让每一个工作流都更简单、更好用。</span>
        </div>
      </footer>
    </main>
  )
}

export default Home
