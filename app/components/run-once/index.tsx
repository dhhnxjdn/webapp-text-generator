import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PlayIcon,
} from '@heroicons/react/24/solid'
import Select from '@/app/components/base/select'
import type { PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import Button from '@/app/components/base/button'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import TextGenerationImageUploader from '@/app/components/base/image-uploader/text-generation-image-uploader'
import WorkflowFileInput from '@/app/components/base/workflow-file-input'

export type IRunOnceProps = {
  workflowSlug: string
  promptConfig: PromptConfig
  inputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
  onSend: () => void
  visionConfig: VisionSettings
  onVisionFilesChange: (files: VisionFile[]) => void
}
const RunOnce: FC<IRunOnceProps> = ({
  promptConfig,
  inputs,
  onInputsChange,
  onSend,
  visionConfig,
  onVisionFilesChange,
  workflowSlug,
}) => {
  const { t } = useTranslation()

  const onClear = () => {
    const newInputs: Record<string, any> = {}
    promptConfig.prompt_variables.forEach((item) => {
      newInputs[item.key] = ''
    })
    onInputsChange(newInputs)
  }

  return (
    <div className="">
      <section>
        {/* input form */}
        <form>
          {promptConfig.prompt_variables.map(item => (
            <div className='w-full mt-5' key={item.key}>
              <label className='text-gray-900 text-sm font-medium'>{item.name}{item.required === false && <span className="ml-1 text-xs font-normal text-gray-400">可选</span>}</label>
              <div className='mt-2'>
                {item.type === 'select' && (
                  <Select
                    className='w-full'
                    defaultValue={inputs[item.key]}
                    onSelect={(i) => { onInputsChange({ ...inputs, [item.key]: i.value }) }}
                    items={(item.options || []).map(i => ({ name: i, value: i }))}
                    allowSearch={false}
                    bgClassName='bg-gray-50'
                  />
                )}
                {item.type === 'string' && (
                  <input
                    type="text"
                    className="block h-11 w-full rounded-xl border border-black/10 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#17191e] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                    placeholder={item.placeholder || `请输入${item.name}`}
                    value={inputs[item.key] ?? ''}
                    onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                    maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                  />
                )}
                {item.type === 'paragraph' && (
                  <textarea
                    className="block w-full h-[150px] resize-y rounded-xl border border-black/10 bg-gray-50 p-3.5 text-sm leading-6 text-gray-900 outline-none transition focus:border-[#17191e] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                    placeholder={item.placeholder || `请输入${item.name}`}
                    value={inputs[item.key] ?? ''}
                    onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                  />
                )}
                {item.type === 'number' && (
                  <input
                    type="number"
                    className="block h-11 w-full rounded-xl border border-black/10 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#17191e] focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                    placeholder={item.placeholder || `请输入${item.name}`}
                    value={inputs[item.key] ?? ''}
                    onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                  />
                )}
                {(item.type === 'file' || item.type === 'file-list') && (
                  <WorkflowFileInput
                    workflowSlug={workflowSlug}
                    multiple={item.type === 'file-list'}
                    maxFiles={item.maxFiles}
                    value={inputs[item.key]}
                    onChange={value => onInputsChange({ ...inputs, [item.key]: value })}
                  />
                )}
              </div>
              {item.hint && <div className="mt-1.5 text-xs text-gray-400">{item.hint}</div>}
            </div>
          ))}
          {
            visionConfig?.enabled && (
              <div className="w-full mt-4">
                <div className="text-gray-900 text-sm font-medium">{t('common.imageUploader.imageUpload')}</div>
                <div className='mt-2'>
                  <TextGenerationImageUploader
                    workflowSlug={workflowSlug}
                    settings={visionConfig}
                    onFilesChange={files => onVisionFilesChange(files.filter(file => file.progress !== -1).map(fileItem => ({
                      type: 'image',
                      transfer_method: fileItem.type,
                      url: fileItem.url,
                      upload_file_id: fileItem.fileId,
                    })))}
                  />
                </div>
              </div>
            )
          }
          {promptConfig.prompt_variables.length > 0 && (
            <div className='mt-4 h-[1px] bg-gray-100'></div>
          )}
          <div className='w-full mt-5'>
            <div className="flex items-center justify-between">
              <Button
                className='!h-10 !rounded-xl !px-4'
                onClick={onClear}
                disabled={false}
              >
                <span className='text-[13px]'>{t('common.operation.clear')}</span>
              </Button>
              <Button
                type="primary"
                className='!h-10 !rounded-xl !pl-4 !pr-5'
                onClick={onSend}
                disabled={false}
              >
                <PlayIcon className="shrink-0 w-4 h-4 mr-1" aria-hidden="true" />
                <span className='text-[13px]'>{t('app.generation.run')}</span>
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
export default React.memo(RunOnce)
