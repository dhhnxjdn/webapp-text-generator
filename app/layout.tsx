import type { Metadata } from 'next'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  title: {
    default: '大鲤传媒 · AI 工作流平台',
    template: '%s · 大鲤传媒',
  },
  description: '大鲤传媒 AI 工作流平台，让数据检测、内容生成与智能处理更简单。',
}

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}

export default LocaleLayout
