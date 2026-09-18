import 'server-only'
import { decryptSecret, encryptSecret } from '@/lib/crypto/secrets'
import { getRegistryStore } from '@/lib/registry/store'
import { RESULT_MODES, WORKFLOW_TYPES } from '@/types/workflow'
import type { AdminWorkflow, PublicWorkflow, RegistryDocument, WorkflowInput, WorkflowRecord } from '@/types/workflow'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const cleanUrl = (value?: string) => {
  const url = (value || process.env.DIFY_API_URL || 'https://api.dify.ai/v1').trim().replace(/\/$/, '')
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol))
    throw new Error('API 地址必须使用 HTTP 或 HTTPS')
  return url
}

const validateInput = (input: WorkflowInput, isCreate: boolean) => {
  const slug = input.slug?.trim()
  const name = input.name?.trim()
  if (!slug || !SLUG_PATTERN.test(slug))
    throw new Error('slug 只能包含小写字母、数字和中划线')
  if (!name || name.length > 80)
    throw new Error('工作流名称不能为空，且不能超过 80 个字符')
  if ((input.description || '').length > 300)
    throw new Error('工作流简介不能超过 300 个字符')
  if (isCreate && !input.apiKey?.trim())
    throw new Error('新增工作流必须填写 API Key')
  if (input.type && !WORKFLOW_TYPES.includes(input.type))
    throw new Error('不支持的工作流类型')
  if (input.resultMode && !RESULT_MODES.includes(input.resultMode))
    throw new Error('不支持的结果展示模式')
}

const normalize = (document: RegistryDocument): RegistryDocument => ({
  version: 1,
  revision: Number(document.revision || 0),
  items: Array.isArray(document.items) ? document.items : [],
})

export const listPublicWorkflows = async (): Promise<PublicWorkflow[]> => {
  const document = normalize(await getRegistryStore().read())
  return document.items
    .filter(item => item.enabled)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'zh-CN'))
    .map(({ slug, name, icon, description, type, resultMode, enabled, order }) => ({
      slug, name, icon, description, type, resultMode, enabled, order,
    }))
}

export const getPublicWorkflow = async (slug: string) => {
  const workflows = await listPublicWorkflows()
  return workflows.find(workflow => workflow.slug === slug) || null
}

export const listAdminWorkflows = async (): Promise<AdminWorkflow[]> => {
  const document = normalize(await getRegistryStore().read())
  return document.items
    .slice()
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'zh-CN'))
    .map(({ encryptedApiKey, ...item }) => ({ ...item, apiKeyConfigured: Boolean(encryptedApiKey) }))
}

export const getWorkflowRecord = async (slug: string, includeDisabled = false) => {
  const document = normalize(await getRegistryStore().read())
  const item = document.items.find(item => item.slug === slug)
  if (!item || (!includeDisabled && !item.enabled))
    return null

  return {
    ...item,
    apiKey: await decryptSecret(item.encryptedApiKey),
  }
}

export const createWorkflow = async (input: WorkflowInput) => {
  validateInput(input, true)
  const store = getRegistryStore()
  const document = normalize(await store.read())
  if (document.items.some(item => item.slug === input.slug))
    throw new Error('这个 slug 已经存在')

  const now = new Date().toISOString()
  const record: WorkflowRecord = {
    version: 1,
    slug: input.slug.trim(),
    name: input.name.trim(),
    icon: input.icon?.trim() || 'sparkles',
    description: input.description?.trim() || '',
    appId: input.appId?.trim() || undefined,
    apiUrl: cleanUrl(input.apiUrl),
    encryptedApiKey: await encryptSecret(input.apiKey!.trim()),
    type: input.type || 'workflow',
    resultMode: input.resultMode || 'auto',
    enabled: input.enabled ?? true,
    order: Number.isFinite(input.order) ? Number(input.order) : document.items.length,
    createdAt: now,
    updatedAt: now,
    revision: 1,
  }
  await store.write({ ...document, revision: document.revision + 1, items: [...document.items, record] })
  return { ...record, encryptedApiKey: undefined }
}

export const updateWorkflow = async (slug: string, input: WorkflowInput) => {
  validateInput({ ...input, slug }, false)
  const store = getRegistryStore()
  const document = normalize(await store.read())
  const index = document.items.findIndex(item => item.slug === slug)
  if (index < 0)
    throw new Error('工作流不存在')

  const current = document.items[index]
  if (input.revision !== undefined && input.revision !== current.revision)
    throw new Error('工作流已经被其他操作更新，请刷新后重试')

  const updated: WorkflowRecord = {
    ...current,
    name: input.name.trim(),
    icon: input.icon?.trim() || current.icon,
    description: input.description?.trim() || '',
    appId: input.appId?.trim() || undefined,
    apiUrl: cleanUrl(input.apiUrl || current.apiUrl),
    encryptedApiKey: input.apiKey?.trim() ? await encryptSecret(input.apiKey.trim()) : current.encryptedApiKey,
    type: input.type || current.type,
    resultMode: input.resultMode || current.resultMode,
    enabled: input.enabled ?? current.enabled,
    order: Number.isFinite(input.order) ? Number(input.order) : current.order,
    updatedAt: new Date().toISOString(),
    revision: current.revision + 1,
  }
  const items = document.items.slice()
  items[index] = updated
  await store.write({ ...document, revision: document.revision + 1, items })
  return { ...updated, encryptedApiKey: undefined }
}

export const deleteWorkflow = async (slug: string) => {
  const store = getRegistryStore()
  const document = normalize(await store.read())
  if (!document.items.some(item => item.slug === slug))
    throw new Error('工作流不存在')
  await store.write({
    ...document,
    revision: document.revision + 1,
    items: document.items.filter(item => item.slug !== slug),
  })
}
