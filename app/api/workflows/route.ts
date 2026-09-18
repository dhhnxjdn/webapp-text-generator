import { NextResponse } from 'next/server'
import { listPublicWorkflows } from '@/lib/registry/registry'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await listPublicWorkflows(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message || '工作流列表加载失败' }, { status: 503 })
  }
}
