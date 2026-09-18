import { type NextRequest, NextResponse } from 'next/server'
import { getWorkflowContext, sessionHeader } from '@/lib/dify/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { client, sessionId, user } = await getWorkflowContext(request, slug)
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': sessionHeader(sessionId),
      },
    })
  }
  catch (error: any) {
    const status = error.message === 'WORKFLOW_NOT_FOUND' ? 404 : 502
    return NextResponse.json({ message: status === 404 ? '工作流不存在或已停用' : '无法读取工作流参数' }, { status })
  }
}
