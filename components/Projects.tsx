import { projects } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="// Things I've built" title="Projects" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
