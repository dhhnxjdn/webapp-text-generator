import { BoltIcon, ChartBarIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline'

const icons = {
  chart: ChartBarIcon,
  document: DocumentTextIcon,
  bolt: BoltIcon,
  sparkles: SparklesIcon,
}

const WorkflowIcon = ({ name }: { name?: string }) => {
  const Icon = icons[name as keyof typeof icons] || SparklesIcon
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17191e] text-white shadow-[0_8px_24px_rgba(17,19,24,0.12)]">
      <Icon className="h-5 w-5" />
    </div>
  )
}

export default WorkflowIcon
