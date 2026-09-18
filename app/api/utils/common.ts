import 'server-only'
import { type NextRequest } from 'next/server'
import { CompletionClient } from 'dify-client'
import { v4 } from 'uuid'

const userPrefix = `user_${process.env.DIFY_APP_ID || 'legacy'}:`

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new CompletionClient(
  process.env.DIFY_API_KEY || '',
  process.env.DIFY_API_URL || undefined,
)
