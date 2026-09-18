import { type NextRequest, NextResponse } from 'next/server'
import { getWorkflowContext, sessionHeader } from '@/lib/dify/client'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const body = await request.json()
    if (!body.inputs || typeof body.inputs !== 'object' || Array.isArray(body.inputs))
      return NextResponse.json({ message: 'inputs 必须是对象' }, { status: 400 })

    const { client, sessionId, user } = await getWorkflowContext(request, slug)
    const res = await client.runWorkflow(body.inputs, user, true, body.files || [])
    return new Response(res.data as any, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, no-transform',
        'X-Accel-Buffering': 'no',
        'Set-Cookie': sessionHeader(sessionId),
      },
    })
  }
  catch (error: any) {
    const status = error.message === 'WORKFLOW_NOT_FOUND' ? 404 : 502
    return NextResponse.json({ message: status === 404 ? '工作流不存在或已停用' : '工作流运行失败' }, { status })
  }
}
