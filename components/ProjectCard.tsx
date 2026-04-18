import type { Project } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] transition hover:border-[var(--accent)]">
      <div
        className={`aspect-[16/9] w-full bg-gradient-to-br ${project.gradient} opacity-80 transition group-hover:opacity-100`}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[var(--fg)]">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          {project.description}
        </p>
      </div>
    </article>
  );
}
