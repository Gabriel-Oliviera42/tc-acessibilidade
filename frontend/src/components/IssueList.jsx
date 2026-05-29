import { Bot, Code2, Layers3, MessageCircle, ShieldAlert } from 'lucide-react'

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

const severityOrder = {
  critical: 0,
  serious: 1,
  moderate: 2,
  minor: 3,
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

  const errosOrdenados = [...resultado.erros].sort((a, b) => {
    const impactoA = severityOrder[a.impacto] ?? 99
    const impactoB = severityOrder[b.impacto] ?? 99

    if (impactoA !== impactoB) return impactoA - impactoB

    return String(a.id).localeCompare(String(b.id))
  })

  return (
    <section className="flex min-h-0 flex-col space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-500">
          <ShieldAlert size={17} aria-hidden="true" />
          Problemas encontrados
        </div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          Lista de problemas ({resultado.total_erros})
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Esta primeira lista mostra cada elemento afetado. A estrutura ja deixa espaco para
          agrupar por regra, filtrar por severidade e exibir referencias WCAG com mais detalhes.
        </p>
      </div>

      <div className="max-h-[calc(100vh-26rem)] min-h-[26rem] space-y-3 overflow-y-auto pr-2">
        {errosOrdenados.map((erro, index) => (
          <article
            key={`${erro.id}-${index}`}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      severityClasses[erro.impacto] || severityClasses.minor
                    }`}
                  >
                    {severityLabels[erro.impacto] || erro.impacto}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <Layers3 size={13} aria-hidden="true" />
                    {erro.id}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-950">{erro.ajuda}</h3>
              </div>

              <button
                type="button"
                onClick={() => perguntarSobreErro(erro)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Perguntar a IA
              </button>
            </div>

            <div className="grid gap-4 p-4">
              <div className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <Bot size={16} className="text-blue-700" aria-hidden="true" />
                  Diagnostico
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{erro.descricao}</p>
              </div>

              <div className="min-w-0 rounded-md border border-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-950">
                  <Code2 size={16} className="text-blue-700" aria-hidden="true" />
                  Elemento afetado
                </div>
                <pre className="max-h-40 max-w-full overflow-auto bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                  <code>{erro.elemento_html}</code>
                </pre>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
