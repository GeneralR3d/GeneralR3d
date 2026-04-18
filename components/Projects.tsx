"use client";

import { ArrowRight } from "lucide-react";
import { CategoryList, type Category } from "./ui/category-list";
import { projects } from "@/lib/data";

const categories: Category[] = projects.map((p, i) => ({
  id: p.name,
  title: p.name,
  subtitle: p.description,
  featured: i === 0,
  icon: <ArrowRight className="w-8 h-8" />,
  onClick: () => p.link && window.open(p.link, "_blank", "noopener,noreferrer"),
}));

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10">
        <h2 className="font-pixel text-3xl tracking-widest text-(--accent) md:text-4xl">
          // Things I&apos;ve built
        </h2>
      </div>
      <CategoryList categories={categories} />
    </section>
  );
}
