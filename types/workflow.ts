export const WORKFLOW_TYPES = ['workflow', 'completion'] as const
export type WorkflowType = typeof WORKFLOW_TYPES[number]

export const RESULT_MODES = ['auto', 'markdown', 'json', 'metrics', 'table'] as const
export type ResultMode = typeof RESULT_MODES[number]

export type WorkflowRecord = {
  version: 1
  slug: string
  name: string
  icon: string
  description: string
  appId?: string
  apiUrl?: string
  encryptedApiKey: string
  type: WorkflowType
  resultMode: ResultMode
  enabled: boolean
  order: number
  createdAt: string
  updatedAt: string
  revision: number
}

export type PublicWorkflow = Pick<WorkflowRecord,
  'slug' | 'name' | 'icon' | 'description' | 'type' | 'resultMode' | 'enabled' | 'order'>

export type AdminWorkflow = Omit<WorkflowRecord, 'encryptedApiKey'> & {
  apiKeyConfigured: boolean
}

export type WorkflowInput = {
  slug: string
  name: string
  icon?: string
  description?: string
  appId?: string
  apiUrl?: string
  apiKey?: string
  type?: WorkflowType
  resultMode?: ResultMode
  enabled?: boolean
  order?: number
  revision?: number
}

export type RegistryDocument = {
  version: 1
  revision: number
  items: WorkflowRecord[]
}
