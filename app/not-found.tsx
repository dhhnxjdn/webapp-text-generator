import Link from 'next/link'

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-6">
    <div className="max-w-md text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17191e] text-xl text-white">鲤</div>
      <div className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe2c55]">404</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">这个工作流不存在</h1>
      <p className="mt-3 text-sm leading-6 text-gray-500">它可能已被停用、删除，或者链接地址有误。</p>
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#17191e] px-5 py-3 text-sm font-medium text-white">返回工作流广场</Link>
    </div>
  </main>
)

export default NotFound
