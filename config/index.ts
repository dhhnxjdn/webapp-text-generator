import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const IS_WORKFLOW = `${process.env.NEXT_PUBLIC_APP_TYPE_WORKFLOW}` === 'true'
export const APP_INFO: AppInfo = {
  title: '抖音数据检测',
  description: '粘贴抖音链接或整段分享文本，自动抓取播放量、点赞、评论、收藏、分享数据，并生成可下载的报告；支持多条链接一次处理。',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const API_PREFIX = `${process.env.NEXT_PUBLIC_API_PREFIX || '/api'}`

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
