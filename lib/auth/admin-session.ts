const encoder = new TextEncoder()
const COOKIE_NAME = 'dali_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

const toBase64 = (value: Uint8Array) => btoa(String.fromCharCode(...Array.from(value)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '')

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (secret)
    return secret
  if (process.env.NODE_ENV !== 'production')
    return 'dali-media-local-development-session-secret'
  return ''
}

const sign = async (value: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return toBase64(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))))
}

const safeEqual = (left: string, right: string) => {
  if (left.length !== right.length)
    return false
  let result = 0
  for (let index = 0; index < left.length; index++)
    result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return result === 0
}

export const verifyAdminPassword = (password: string) => {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured)
    return false
  return safeEqual(password, configured)
}

export const isAdminAuthConfigured = () => Boolean(
  process.env.ADMIN_PASSWORD && getSessionSecret(),
)

export const createAdminSession = async () => {
  if (!isAdminAuthConfigured())
    throw new Error('Admin authentication is not configured')
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = `v1.${expiresAt}.${crypto.randomUUID()}`
  return `${payload}.${await sign(payload)}`
}

export const verifyAdminSession = async (token?: string) => {
  if (!token || !getSessionSecret())
    return false
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v1')
    return false
  const payload = parts.slice(0, 3).join('.')
  if (Number(parts[1]) < Math.floor(Date.now() / 1000))
    return false
  return safeEqual(parts[3], await sign(payload))
}

export const adminSessionCookie = (token: string) => (
  `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
)

export const clearAdminSessionCookie = () => (
  `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
)

export { COOKIE_NAME as ADMIN_SESSION_COOKIE }
