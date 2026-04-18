import type { Experience } from "@/lib/data"

export function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-(--border) bg-(--bg-elev) p-6 transition hover:border-(--accent)">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${exp.gradient} opacity-20 transition group-hover:opacity-30`}
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-(--fg)">{exp.company}</h3>
        <span className="font-pixel text-sm text-(--fg-muted)">{exp.period}</span>
      </div>
      <p className="mt-1 text-sm text-(--fg-muted)">
        {exp.role} · {exp.location}
      </p>
      <ul className="mt-4 space-y-2">
        {exp.bullets.slice(0, 3).map((bullet, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-(--fg)/90">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent)" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-(--border) px-2.5 py-0.5 font-pixel text-xs text-(--fg-muted)"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
