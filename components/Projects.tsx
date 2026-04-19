"use client";

import Image from "next/image";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-4">
        <h2 className="font-pixel text-3xl tracking-widest text-(--accent) md:text-4xl">
          // Things I&apos;ve built
        </h2>
      </div>
      <div className="columns-1 sm:columns-2">
        {projects.map((project, i) => (
          <div key={project.name} className="project-card-parent break-inside-avoid">
            <div className="project-card">
              <div className="project-card-image">
                <div className="project-card-image-inner">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${project.image}`}
                    alt={project.name}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
              <div className="project-card-content">
                <span className="project-card-title">{project.name}</span>
                <p className="project-card-description">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-see-more"
                >
                  See More
                </a>
              </div>
              <div className="project-card-date">
                <span className="project-card-date-num">{i + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
