import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import WorkflowRunner from '@/app/components'
import { getPublicWorkflow } from '@/lib/registry/registry'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const workflow = await getPublicWorkflow(slug).catch(() => null)
  return {
    title: workflow?.name || '工作流',
    description: workflow?.description || '大鲤传媒 AI 工作流平台',
  }
}

const WorkflowPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const workflow = await getPublicWorkflow(slug).catch(() => null)
  if (!workflow)
    notFound()

  return <WorkflowRunner workflow={workflow} />
}

export default WorkflowPage
