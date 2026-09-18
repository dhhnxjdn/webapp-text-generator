import 'server-only'
import type { NextRequest } from 'next/server'
import { CompletionClient } from 'dify-client'
import { v4 } from 'uuid'
import { getWorkflowRecord } from '@/lib/registry/registry'

export const createDifyClient = ({ apiKey, apiUrl }: { apiKey: string; apiUrl?: string }) => (
  new CompletionClient(apiKey, apiUrl || process.env.DIFY_API_URL || 'https://api.dify.ai/v1')
)

export const getWorkflowContext = async (request: NextRequest, slug: string, includeDisabled = false) => {
  const workflow = await getWorkflowRecord(slug, includeDisabled)
  if (!workflow)
    throw new Error('WORKFLOW_NOT_FOUND')

  const sessionId = request.cookies.get('session_id')?.value || v4()
  return {
    workflow,
    client: createDifyClient(workflow),
    sessionId,
    user: `user_${workflow.slug}:${sessionId}`,
  }
}

export const sessionHeader = (sessionId: string) => (
  `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
)
