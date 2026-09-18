import type { ResultMode } from '@/types/workflow'

const formatValue = (value: unknown) => {
  if (value === null || value === undefined)
    return '—'
  if (typeof value === 'boolean')
    return value ? '是' : '否'
  if (typeof value === 'object')
    return JSON.stringify(value, null, 2)
  return String(value)
}

const StructuredResult = ({ value, mode }: { value: unknown; mode: ResultMode }) => {
  const rows = Array.isArray(value) ? value : null
  if ((mode === 'table' || mode === 'auto') && rows?.length && rows.every(row => row && typeof row === 'object' && !Array.isArray(row))) {
    const columns = Array.from(new Set(rows.flatMap(row => Object.keys(row as Record<string, unknown>))))
    return (
      <div className="overflow-x-auto rounded-xl border border-black/[0.07]">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs">
          <thead className="bg-gray-50 text-gray-500"><tr>{columns.map(column => <th key={column} className="border-b border-black/[0.06] px-3 py-2.5 font-medium">{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={index} className="border-b border-black/[0.05] last:border-0">{columns.map(column => <td key={column} className="max-w-[280px] px-3 py-3 align-top text-gray-700"><div className="whitespace-pre-wrap break-words">{formatValue((row as Record<string, unknown>)[column])}</div></td>)}</tr>)}</tbody>
        </table>
      </div>
    )
  }

  if (value && typeof value === 'object' && !Array.isArray(value) && mode !== 'json') {
    const entries = Object.entries(value as Record<string, unknown>)
    const primitiveEntries = entries.filter(([, item]) => item === null || ['string', 'number', 'boolean'].includes(typeof item))
    const complexEntries = entries.filter(([, item]) => item !== null && typeof item === 'object')
    return (
      <div className="space-y-4">
        {primitiveEntries.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {primitiveEntries.map(([key, item]) => (
              <div key={key} className="rounded-xl border border-black/[0.07] bg-gray-50 p-4">
                <div className="text-[11px] text-gray-400">{key}</div>
                <div className="mt-2 break-words text-lg font-semibold tracking-[-0.02em] text-gray-900">{formatValue(item)}</div>
              </div>
            ))}
          </div>
        )}
        {complexEntries.map(([key, item]) => <div key={key}><div className="mb-2 text-xs font-medium text-gray-500">{key}</div><pre className="overflow-x-auto rounded-xl bg-[#17191e] p-4 text-xs leading-5 text-gray-100">{JSON.stringify(item, null, 2)}</pre></div>)}
      </div>
    )
  }

  return <pre className="overflow-x-auto rounded-xl bg-[#17191e] p-4 text-xs leading-5 text-gray-100">{JSON.stringify(value, null, 2)}</pre>
}

export default StructuredResult
