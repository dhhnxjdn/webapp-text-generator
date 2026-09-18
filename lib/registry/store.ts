import 'server-only'
import { Redis } from '@upstash/redis'
import type { RegistryDocument } from '@/types/workflow'

const REGISTRY_KEY = 'workflow_registry_v1'
const EMPTY_REGISTRY: RegistryDocument = { version: 1, revision: 0, items: [] }

export type RegistryStore = {
  read(): Promise<RegistryDocument>
  write(value: RegistryDocument): Promise<void>
}

class UpstashRegistryStore implements RegistryStore {
  private readonly redis: Redis

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  async read() {
    return (await this.redis.get<RegistryDocument>(REGISTRY_KEY)) || EMPTY_REGISTRY
  }

  async write(value: RegistryDocument) {
    await this.redis.set(REGISTRY_KEY, value)
  }
}

const globalRegistry = globalThis as typeof globalThis & {
  __daliWorkflowRegistry?: RegistryDocument
}

class DevelopmentMemoryStore implements RegistryStore {
  async read() {
    return globalRegistry.__daliWorkflowRegistry || EMPTY_REGISTRY
  }

  async write(value: RegistryDocument) {
    globalRegistry.__daliWorkflowRegistry = value
  }
}

let store: RegistryStore | undefined

export const getRegistryStore = (): RegistryStore => {
  if (store)
    return store

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    store = new UpstashRegistryStore()
  else if (process.env.NODE_ENV !== 'production')
    store = new DevelopmentMemoryStore()
  else
    throw new Error('Workflow registry storage is not configured')

  return store
}
