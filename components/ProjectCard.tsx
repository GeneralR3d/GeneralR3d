import Image from "next/image";
import type { Project } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.link || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-2xl border border-(--border) bg-(--bg-elev) transition hover:border-(--accent) ${!project.link ? "pointer-events-none" : ""}`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover opacity-80 transition group-hover:opacity-100"
        />
      </div>
      <div className="p-6 pb-8">
        <h3 className="text-xl font-semibold text-(--fg)">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-(--fg)/90">
          {project.description}
        </p>
      </div>
    </a>
  );
}
