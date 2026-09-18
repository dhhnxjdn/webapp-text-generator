import 'server-only'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const getSecret = () => {
  const secret = process.env.REGISTRY_ENCRYPTION_KEY
  if (secret)
    return secret

  if (process.env.NODE_ENV !== 'production')
    return 'dali-media-local-development-encryption-key'

  throw new Error('REGISTRY_ENCRYPTION_KEY is not configured')
}

const getKey = async () => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(getSecret()))
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

const toBase64 = (value: Uint8Array) => Buffer.from(value).toString('base64url')
const fromBase64 = (value: string) => new Uint8Array(Buffer.from(value, 'base64url'))

export const encryptSecret = async (value: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await getKey(),
    encoder.encode(value),
  )

  return `v1.${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`
}

export const decryptSecret = async (value: string) => {
  const [version, iv, encrypted] = value.split('.')
  if (version !== 'v1' || !iv || !encrypted)
    throw new Error('Unsupported encrypted secret format')

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    await getKey(),
    fromBase64(encrypted),
  )

  return decoder.decode(decrypted)
}
