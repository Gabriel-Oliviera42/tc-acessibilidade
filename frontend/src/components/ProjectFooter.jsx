import {
  BriefcaseBusiness,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers3,
  UserRound,
} from 'lucide-react'

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/Gabriel-Oliviera42',
    Icon: GitBranch,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gabriel-lourenco-ab7893273',
    Icon: BriefcaseBusiness,
  },
]

const techs = ['React', 'FastAPI', 'AxeCore', 'Playwright', 'IA']

export default function ProjectFooter({ compact = false }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${compact ? 'py-5' : 'py-7'}`}>
        <div className="grid gap-6 text-sm text-slate-600 lg:grid-cols-[1.2fr_1fr_1fr]">
          <section>
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Layers3 size={18} className="text-blue-700" aria-hidden="true" />
              Sobre o projeto
            </div>
            <p className="mt-2 max-w-xl leading-6">
              Ferramenta academica para ajudar estudantes e desenvolvedores a encontrar,
              entender e corrigir barreiras de acessibilidade em paginas web.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <GraduationCap size={18} className="text-blue-700" aria-hidden="true" />
              TCC
            </div>
            <p className="mt-2 leading-6">
              UNIFENAS Alfenas<br />
              7 periodo<br />
              Orientador: professor Celso
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <UserRound size={18} className="text-blue-700" aria-hidden="true" />
              Gabriel Lourenco de Oliveira
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  <link.Icon size={16} aria-hidden="true" />
                  {link.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </footer>
  )
}
