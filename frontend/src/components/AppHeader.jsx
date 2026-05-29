import { Download, Settings } from 'lucide-react'

export default function AppHeader({ onSoon }) {
  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            AL
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950">AcessiLab</p>
            <p className="text-xs text-slate-500">Auditoria de acessibilidade com IA</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSoon('Configuracoes')}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Settings size={16} aria-hidden="true" />
            Configuracoes
          </button>
          <button
            type="button"
            onClick={() => onSoon('Baixar app')}
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Download size={16} aria-hidden="true" />
            App em breve
          </button>
        </nav>
      </div>
    </header>
  )
}
