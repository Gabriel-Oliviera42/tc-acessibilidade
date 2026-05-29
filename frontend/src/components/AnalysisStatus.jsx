export default function AnalysisStatus({ statusAnalise, erroBackend }) {
  if (!statusAnalise && !erroBackend) return null

  return (
    <section
      className={`rounded-lg border px-4 py-3 ${
        erroBackend
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-blue-200 bg-blue-50 text-blue-950'
      }`}
      aria-live="polite"
    >
      <p className="text-sm font-semibold">{erroBackend ? 'Analise interrompida' : 'Status da analise'}</p>
      <p className="mt-1 text-sm leading-6">{erroBackend || statusAnalise}</p>
    </section>
  )
}
