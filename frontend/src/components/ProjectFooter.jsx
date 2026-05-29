const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/Gabriel-Oliviera42',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gabriel-lourenco-ab7893273',
  },
]

export default function ProjectFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-7 text-sm text-slate-600 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <p className="font-semibold text-slate-950">AcessiLab</p>
          <p className="mt-2 max-w-xl leading-6">
            Projeto de TCC focado em tornar problemas de acessibilidade mais claros para estudantes
            e desenvolvedores em inicio de jornada.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-950">Contexto academico</p>
          <p className="mt-2 leading-6">
            Gabriel Lourenco de Oliveira<br />
            UNIFENAS Alfenas, 7 periodo<br />
            Orientador: professor Celso
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-950">Links</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-700 underline-offset-4 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
