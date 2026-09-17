import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type INoDataProps = {}
const NoData: FC<INoDataProps> = () => {
  const { t } = useTranslation()
  const steps = [
    t('app.generation.howto.step1'),
    t('app.generation.howto.step2'),
    t('app.generation.howto.step3'),
  ]
  return (
    <div className='flex flex-col h-full w-full justify-center items-center px-8'>
      <div className='w-full max-w-md'>
        <div className='text-gray-800 text-base font-semibold mb-1'>{t('app.generation.howto.title')}</div>
        <div className='text-gray-500 text-xs mb-5'>{t('app.generation.howto.subtitle')}</div>
        <ol className='space-y-3'>
          {steps.map((step, i) => (
            <li key={i} className='flex items-start'>
              <span className='shrink-0 mr-3 flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold'>{i + 1}</span>
              <span className='text-gray-600 text-xs leading-5'>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
export default React.memo(NoData)
