"use client";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  featured?: boolean;
}

export interface CategoryListProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: React.ReactNode;
  className?: string;
}

function CategoryRow({ category }: { category: Category }) {
  const leftImgRef = useRef<HTMLDivElement>(null);
  const [imgW, setImgW] = useState(0);
  const [hoverDir, setHoverDir] = useState<"left" | "right" | null>(null);

  // Image card width = container height × 16/9, measured via the left image div
  // (absolute, top-0 bottom-0, aspect-ratio 16/9 — sized by the container at rest)
  useLayoutEffect(() => {
    const el = leftImgRef.current;
    if (!el) return;
    const measure = () => setImgW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverDir(e.clientX > rect.left + rect.width / 2 ? "right" : "left");
  }, []);

  const isHovered = hoverDir !== null;
  const tx = isHovered ? (hoverDir === "right" ? imgW : -imgW) : 0;
  const ease = "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)";

  const imgEl = category.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={category.image} alt="" className="w-full h-full object-cover" />
  ) : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden border cursor-pointer transition-colors duration-300",
        isHovered ? "border-(--accent) shadow-lg" : "border-(--border)"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverDir(null)}
      onClick={category.onClick}
    >
      {/* Left image — lives outside the container to the left; slides in on hover-right */}
      <div
        ref={leftImgRef}
        className="absolute top-0 bottom-0 overflow-hidden"
        style={{
          right: "100%",
          aspectRatio: "16 / 9",
          transform: `translateX(${hoverDir === "right" ? imgW : 0}px)`,
          transition: ease,
        }}
      >
        {imgEl}
      </div>

      {/* Right image — lives outside the container to the right; slides in on hover-left */}
      <div
        className="absolute top-0 bottom-0 overflow-hidden"
        style={{
          left: "100%",
          aspectRatio: "16 / 9",
          transform: `translateX(${hoverDir === "left" ? -imgW : 0}px)`,
          transition: ease,
        }}
      >
        {imgEl}
      </div>

      {/* Project card — normal flow (sets the container height), slides on hover */}
      <div
        className="bg-(--bg-elev) py-6 px-6 md:px-8"
        style={{ transform: `translateX(${tx}px)`, transition: ease }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3
              className={cn(
                "font-bold transition-colors duration-300",
                category.featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
                isHovered ? "text-(--accent)" : "text-(--fg)"
              )}
            >
              {category.title}
            </h3>
            {category.subtitle && (
              <p
                className={cn(
                  "mt-1 text-sm md:text-base transition-colors duration-300",
                  isHovered ? "text-(--fg)/90" : "text-(--fg-muted)"
                )}
              >
                {category.subtitle}
              </p>
            )}
          </div>
          {category.icon && (
            <div
              className={cn(
                "text-(--accent) ml-4 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              {category.icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
}: CategoryListProps) => {
  return (
    <div className={cn("w-full text-(--fg) p-8", className)}>
      <div className="max-w-4xl mx-auto">
        {(title || subtitle || headerIcon) && (
          <div className="text-center mb-12 md:mb-16">
            {headerIcon && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-(--accent)/80 to-(--accent) mb-6 text-white">
                {headerIcon}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <h2 className="text-4xl md:text-5xl font-bold text-(--fg-muted)">
                {subtitle}
              </h2>
            )}
          </div>
        )}

        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};
