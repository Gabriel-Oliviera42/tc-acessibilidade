const severityLabels = {
  critical: 'Critico',
  serious: 'Serio',
  moderate: 'Moderado',
  minor: 'Menor',
}

const severityClasses = {
  critical: 'border-red-200 bg-red-50 text-red-800',
  serious: 'border-orange-200 bg-orange-50 text-orange-800',
  moderate: 'border-amber-200 bg-amber-50 text-amber-900',
  minor: 'border-cyan-200 bg-cyan-50 text-cyan-800',
}

export default function IssueList({ resultado, perguntarSobreErro }) {
  if (!resultado) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        O relatorio aparecera aqui depois que a primeira URL for analisada.
      </section>
    )
  }

  if (!resultado.erros?.length) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        Nenhum problema de acessibilidade foi encontrado pela analise automatizada.
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Problemas encontrados</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          Lista de problemas ({resultado.total_erros})
        </h2>
      </div>

      <div className="space-y-3">
        {resultado.erros.map((erro, index) => (
          <article key={`${erro.id}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    severityClasses[erro.impacto] || severityClasses.minor
                  }`}
                >
                  {severityLabels[erro.impacto] || erro.impacto}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-950">{erro.ajuda}</h3>
              </div>

              <button
                type="button"
                onClick={() => perguntarSobreErro(erro)}
                className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
              >
                Perguntar a IA
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">{erro.descricao}</p>

            <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
              <code>{erro.elemento_html}</code>
            </pre>
          </article>
        ))}
      </div>
    </section>
  )
}
