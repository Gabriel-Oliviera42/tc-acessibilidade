const items = [
  { key: 'critical', label: 'Criticos', tone: 'bg-red-600 text-white' },
  { key: 'serious', label: 'Serios', tone: 'bg-orange-600 text-white' },
  { key: 'moderate', label: 'Moderados', tone: 'bg-amber-400 text-slate-950' },
  { key: 'minor', label: 'Menores', tone: 'bg-cyan-700 text-white' },
]

export default function AnalysisSummary({ resultado, contagem }) {
  if (!resultado) return null

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Relatorio</p>
          <h1 className="text-2xl font-semibold text-slate-950">{resultado.titulo || 'Site analisado'}</h1>
          <a
            href={resultado.url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            {resultado.url}
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{resultado.total_erros}</p>
          </div>

          {items.map((item) => (
            <div key={item.key} className={`rounded-lg p-4 ${item.tone}`}>
              <p className="text-sm opacity-90">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{contagem[item.key]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
