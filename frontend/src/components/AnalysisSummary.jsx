const items = [
  {
    key: 'critical',
    label: 'Criticos',
    description: 'Corrigir primeiro',
    bar: 'bg-red-600',
    card: 'border-red-200 bg-red-50 text-red-950',
    value: 'text-red-700',
  },
  {
    key: 'serious',
    label: 'Serios',
    description: 'Alta prioridade',
    bar: 'bg-orange-500',
    card: 'border-orange-200 bg-orange-50 text-orange-950',
    value: 'text-orange-700',
  },
  {
    key: 'moderate',
    label: 'Moderados',
    description: 'Revisar depois',
    bar: 'bg-amber-400',
    card: 'border-amber-200 bg-amber-50 text-amber-950',
    value: 'text-amber-700',
  },
  {
    key: 'minor',
    label: 'Menores',
    description: 'Baixo impacto',
    bar: 'bg-cyan-600',
    card: 'border-cyan-200 bg-cyan-50 text-cyan-950',
    value: 'text-cyan-700',
  },
]

export default function AnalysisSummary({ resultado, contagem }) {
  if (!resultado) return null

  const total = resultado.total_erros || 0

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Relatorio</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{resultado.titulo || 'Site analisado'}</h1>
          <a
            href={resultado.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block break-all text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            {resultado.url}
          </a>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 lg:min-w-36">
          <p className="text-sm text-slate-500">Total de elementos</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">{total}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-slate-100">
        <div className="flex h-2 w-full">
          {items.map((item) => {
            const value = contagem[item.key] || 0
            const width = total > 0 ? `${(value / total) * 100}%` : '0%'

            return (
              <div
                key={item.key}
                className={item.bar}
                style={{ width }}
                aria-hidden="true"
              />
            )
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.key} className={`rounded-lg border p-4 ${item.card}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs opacity-75">{item.description}</p>
              </div>
              <p className={`text-3xl font-semibold ${item.value}`}>{contagem[item.key]}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
