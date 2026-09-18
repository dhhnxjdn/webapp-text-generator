'use client'

import { useRef, useState } from 'react'
import { ArrowUpTrayIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { API_PREFIX } from '@/config'

type UploadedFile = {
  type: string
  transfer_method: 'local_file'
  upload_file_id: string
  name: string
}

const getDifyType = (file: File) => {
  if (file.type.startsWith('image/'))
    return 'image'
  if (file.type.startsWith('audio/'))
    return 'audio'
  if (file.type.startsWith('video/'))
    return 'video'
  if (file.type.startsWith('text/') || /pdf|document|sheet|presentation|word|excel|powerpoint/.test(file.type))
    return 'document'
  return 'custom'
}

const WorkflowFileInput = ({ workflowSlug, multiple, maxFiles = 10, value, onChange }: {
  workflowSlug: string
  multiple?: boolean
  maxFiles?: number
  value?: UploadedFile | UploadedFile[]
  onChange: (value: UploadedFile | UploadedFile[] | '') => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const files = Array.isArray(value) ? value : (value ? [value] : [])

  const uploadFiles = async (selected: File[]) => {
    setUploading(true)
    setError('')
    try {
      const uploaded: UploadedFile[] = []
      for (const file of selected.slice(0, multiple ? maxFiles : 1)) {
        const body = new FormData()
        body.append('file', file)
        const response = await fetch(`${API_PREFIX}/w/${workflowSlug}/file-upload`, { method: 'POST', body })
        if (!response.ok)
          throw new Error('上传失败')
        uploaded.push({
          type: getDifyType(file),
          transfer_method: 'local_file',
          upload_file_id: await response.text(),
          name: file.name,
        })
      }
      onChange(multiple ? [...files, ...uploaded].slice(0, maxFiles) : uploaded[0])
    }
    catch {
      setError('文件上传失败，请稍后重试。')
    }
    finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading || files.length >= maxFiles} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-gray-50 px-4 text-xs text-gray-500 transition hover:border-black/25 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
        <ArrowUpTrayIcon className="h-4 w-4" />
        {uploading ? '正在上传…' : multiple ? `选择文件（最多 ${maxFiles} 个）` : '选择文件'}
      </button>
      <input ref={inputRef} hidden type="file" multiple={multiple} onChange={event => uploadFiles(Array.from(event.target.files || []))} />
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map(file => (
            <div key={file.upload_file_id} className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-xs">
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="min-w-0 grow truncate text-gray-600">{file.name}</span>
              <button type="button" onClick={() => {
                const next = files.filter(item => item.upload_file_id !== file.upload_file_id)
                onChange(multiple ? next : '')
              }}><XMarkIcon className="h-4 w-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkflowFileInput
