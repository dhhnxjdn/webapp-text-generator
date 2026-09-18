import type { AppInfo } from '@/types/app'
export const APP_INFO: AppInfo = {
  title: '大鲤传媒',
  description: '把常用的 AI 工作流集中到一个清晰、可靠的平台中。',
  copyright: '大鲤传媒',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const API_PREFIX = `${process.env.NEXT_PUBLIC_API_PREFIX || '/api'}`

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
