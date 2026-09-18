import { type NextRequest, NextResponse } from 'next/server'
import { getWorkflowContext, sessionHeader } from '@/lib/dify/client'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { client, sessionId, user } = await getWorkflowContext(request, slug)
    const conversationId = new URL(request.url).searchParams.get('conversation_id')
    const { data } = await client.getConversationMessages(user, conversationId as string)
    return NextResponse.json(data, { headers: { 'Set-Cookie': sessionHeader(sessionId) } })
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message === 'WORKFLOW_NOT_FOUND' ? '工作流不存在或已停用' : '消息读取失败' }, { status: error.message === 'WORKFLOW_NOT_FOUND' ? 404 : 502 })
  }
}
