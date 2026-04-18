"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

const AUTO_PLAY_DURATION = 5000;

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function VerticalTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Left: tab list */}
      <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
        <div className="flex flex-col space-y-0">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;
            const num = String(index + 1).padStart(2, "0");
            return (
              <button
                key={project.name}
                onClick={() => handleTabClick(index)}
                className={cn(
                  "group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t border-(--border) first:border-0",
                  isActive ? "text-(--fg)" : "text-(--fg-muted) hover:text-(--fg)"
                )}
              >
                {/* vertical progress bar */}
                <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-(--border)">
                  {isActive && (
                    <motion.div
                      key={`progress-${index}-${isPaused}`}
                      className="absolute top-0 left-0 w-full bg-(--accent) origin-top"
                      initial={{ height: "0%" }}
                      animate={isPaused ? { height: "0%" } : { height: "100%" }}
                      transition={{ duration: AUTO_PLAY_DURATION / 1000, ease: "linear" }}
                    />
                  )}
                </div>

                <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                  /{num}
                </span>

                <div className="flex flex-col gap-2 flex-1">
                  <span
                    className={cn(
                      "text-2xl md:text-3xl font-normal tracking-tight transition-colors duration-500",
                      isActive ? "text-(--fg)" : ""
                    )}
                  >
                    {project.name}
                  </span>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-(--fg-muted) text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                          {project.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: image gallery */}
      <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
        <div
          className="relative group/gallery"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-4/3 lg:aspect-16/11 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-(--bg-elev) border border-(--border)">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: "spring", stiffness: 260, damping: 32 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handleNext}
              >
                <Image
                  src={projects[activeIndex].image}
                  alt={projects[activeIndex].name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* External link */}
            {projects[activeIndex].link && (
              <a
                href={projects[activeIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--bg)/80 backdrop-blur border border-(--border) text-(--fg) text-xs font-medium hover:bg-(--bg) transition-all"
              >
                <ExternalLink size={12} />
                View
              </a>
            )}

            {/* Prev / Next arrows */}
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-(--bg)/80 backdrop-blur-md border border-(--border) flex items-center justify-center text-(--fg) hover:bg-(--bg) transition-all active:scale-90"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-(--bg)/80 backdrop-blur-md border border-(--border) flex items-center justify-center text-(--fg) hover:bg-(--bg) transition-all active:scale-90"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerticalTabs;
