import { NextResponse } from 'next/server'
import { createDifyClient } from '@/lib/dify/client'
import { createWorkflow, listAdminWorkflows } from '@/lib/registry/registry'
import type { WorkflowInput } from '@/types/workflow'

export const dynamic = 'force-dynamic'

const testConnection = async (input: WorkflowInput) => {
  const client = createDifyClient({
    apiKey: input.apiKey!.trim(),
    apiUrl: input.apiUrl?.trim() || process.env.DIFY_API_URL,
  })
  await client.getApplicationParameters('admin_connection_test')
}

export async function GET() {
  try {
    return NextResponse.json(await listAdminWorkflows(), { headers: { 'Cache-Control': 'no-store' } })
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message || '工作流列表读取失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const input = await request.json() as WorkflowInput
    await testConnection(input)
    return NextResponse.json(await createWorkflow(input), { status: 201 })
  }
  catch (error: any) {
    const isConnectionError = error?.isAxiosError || error?.response
    const message = isConnectionError
      ? '无法连接 Dify，请检查 API 地址和 API Key'
      : (error.message || '工作流创建失败')
    return NextResponse.json({ message }, { status: 400 })
  }
}
