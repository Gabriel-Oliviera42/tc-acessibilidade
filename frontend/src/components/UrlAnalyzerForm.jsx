import { Search } from 'lucide-react'

export default function UrlAnalyzerForm({
  url,
  setUrl,
  analisarSite,
  carregando,
  compact = false,
}) {
  return (
    <form
      className={compact ? 'flex w-full flex-col gap-3 sm:flex-row' : 'mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row'}
      onSubmit={(event) => {
        event.preventDefault()
        analisarSite()
      }}
    >
      <label className="sr-only" htmlFor={compact ? 'url-analise-compacta' : 'url-analise'}>
        URL do site
      </label>
      <input
        id={compact ? 'url-analise-compacta' : 'url-analise'}
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://exemplo.com"
        className="min-h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
      <button
        type="submit"
        disabled={carregando}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        <Search size={18} aria-hidden="true" />
        {carregando ? 'Analisando...' : 'Analisar'}
      </button>
    </form>
  )
}
