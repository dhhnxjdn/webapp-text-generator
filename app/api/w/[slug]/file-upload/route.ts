import { type NextRequest, NextResponse } from 'next/server'
import { getWorkflowContext, sessionHeader } from '@/lib/dify/client'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const formData = await request.formData()
    const { client, sessionId, user } = await getWorkflowContext(request, slug)
    formData.set('user', user)
    const res = await client.fileUpload(formData)
    return new Response(res.data.id as any, {
      headers: { 'Set-Cookie': sessionHeader(sessionId) },
    })
  }
  catch (error: any) {
    const status = error.message === 'WORKFLOW_NOT_FOUND' ? 404 : 502
    return NextResponse.json({ message: status === 404 ? '工作流不存在或已停用' : '文件上传失败' }, { status })
  }
}
