import { NextResponse } from 'next/server'
import { createDifyClient } from '@/lib/dify/client'
import { deleteWorkflow, getWorkflowRecord, updateWorkflow } from '@/lib/registry/registry'
import type { WorkflowInput } from '@/types/workflow'

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const input = await request.json() as WorkflowInput
    const current = await getWorkflowRecord(slug, true)
    if (!current)
      return NextResponse.json({ message: '工作流不存在' }, { status: 404 })

    const apiKey = input.apiKey?.trim() || current.apiKey
    const apiUrl = input.apiUrl?.trim() || current.apiUrl
    const client = createDifyClient({ apiKey, apiUrl })
    await client.getApplicationParameters('admin_connection_test')

    return NextResponse.json(await updateWorkflow(slug, { ...input, apiKey: input.apiKey?.trim() || undefined }))
  }
  catch (error: any) {
    const isConnectionError = error?.isAxiosError || error?.response
    const message = isConnectionError
      ? '无法连接 Dify，请检查 API 地址和 API Key'
      : (error.message || '工作流更新失败')
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await deleteWorkflow(slug)
    return NextResponse.json({ ok: true })
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message || '工作流删除失败' }, { status: 400 })
  }
}
