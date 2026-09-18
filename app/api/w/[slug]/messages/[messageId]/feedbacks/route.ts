import { type NextRequest, NextResponse } from 'next/server'
import { getWorkflowContext } from '@/lib/dify/client'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string; messageId: string }> }) {
  try {
    const { slug, messageId } = await params
    const { rating } = await request.json()
    if (!['like', 'dislike', null].includes(rating))
      return NextResponse.json({ message: '反馈值无效' }, { status: 400 })
    const { client, user } = await getWorkflowContext(request, slug)
    const { data } = await client.messageFeedback(messageId, rating, user)
    return NextResponse.json(data)
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message === 'WORKFLOW_NOT_FOUND' ? '工作流不存在或已停用' : '反馈提交失败' }, { status: error.message === 'WORKFLOW_NOT_FOUND' ? 404 : 502 })
  }
}
