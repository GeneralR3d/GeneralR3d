"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
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

export const CategoryList = ({
  title,
  subtitle,
  categories,
  headerIcon,
  className,
}: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full text-(--fg) p-8", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(category.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={category.onClick}
            >
              <div
                className={cn(
                  "relative overflow-hidden border bg-(--bg-elev) transition-all duration-300 ease-in-out cursor-pointer",
                  hoveredItem === category.id
                    ? "h-32 border-(--accent) shadow-lg bg-(--accent)/5"
                    : "h-24 border-(--border) hover:border-(--accent)/50"
                )}
              >
                {/* Corner brackets on hover */}
                {hoveredItem === category.id && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-(--accent)" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-(--accent)" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-(--accent)" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-(--accent)" />
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="flex items-center justify-between h-full px-6 md:px-8">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-bold transition-colors duration-300",
                        category.featured
                          ? "text-2xl md:text-3xl"
                          : "text-xl md:text-2xl",
                        hoveredItem === category.id
                          ? "text-(--accent)"
                          : "text-(--fg)"
                      )}
                    >
                      {category.title}
                    </h3>
                    {category.subtitle && (
                      <p
                        className={cn(
                          "mt-1 transition-colors duration-300 text-sm md:text-base",
                          hoveredItem === category.id
                            ? "text-(--fg)"
                            : "text-(--fg-muted)"
                        )}
                      >
                        {category.subtitle}
                      </p>
                    )}
                  </div>

                  {category.icon && hoveredItem === category.id && (
                    <div className="text-(--accent) opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.icon}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
