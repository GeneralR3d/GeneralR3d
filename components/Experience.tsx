"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { experiences, type Experience } from "@/lib/data"
import { SectionHeading } from "./SectionHeading"
import { TextRotate, type TextRotateRef } from "./ui/text-rotate"

const COLS = 14
const ROWS = 10

function MosaicReveal({ bgClass }: { bgClass: string }) {
  const cellDelays = useMemo(
    () => Array.from({ length: COLS * ROWS }, () => Math.random() * 0.55),
    []
  )
  return (
    <div className="absolute inset-0 z-10">
      <div className={`absolute inset-0 ${bgClass}`} />
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {cellDelays.map((delay, i) => (
          <motion.div
            key={i}
            className="bg-(--bg-elev)"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.15, delay, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  )
}

function ExperienceItem({
  exp,
  index,
  onInView,
}: {
  exp: Experience
  index: number
  onInView: (index: number, inView: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-49% 0px -49% 0px" })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    onInView(index, isInView)
  }, [isInView, index, onInView])

  return (
    <div ref={ref} className="flex min-h-[85vh] items-center py-10">
      <article
        className={`relative w-full cursor-pointer select-none overflow-hidden rounded-2xl p-7 transition-opacity duration-500 ${
          isInView ? "opacity-100" : "opacity-40"
        }`}
        onClick={() => setRevealed((v) => !v)}
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-(--fg)">{exp.role}</h3>
          <span className="font-pixel text-sm text-(--fg-muted)">{exp.period}</span>
        </div>
        <ul className="space-y-3">
          {exp.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-(--fg)/85">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent)" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-(--border) px-3 py-1 font-pixel text-xs text-(--fg-muted) transition-colors duration-200 hover:border-(--accent) hover:text-(--accent)"
            >
              {tag}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {revealed && <MosaicReveal bgClass="bg-blue-500" />}
        </AnimatePresence>
      </article>
    </div>
  )
}

function MobileCard({ exp }: { exp: Experience }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <article
      className="relative cursor-pointer select-none overflow-hidden rounded-2xl border border-(--border) bg-(--bg-elev) p-6"
      onClick={() => setRevealed((v) => !v)}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-pixel text-xl text-(--fg)">{exp.company}</h3>
        <span className="font-pixel text-sm text-(--fg-muted)">{exp.period}</span>
      </div>
      <p className="mb-4 text-sm text-(--fg-muted)">
        {exp.role} · {exp.location}
      </p>
      <ul className="space-y-2">
        {exp.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-(--fg)/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent)" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-(--border) px-3 py-1 font-pixel text-xs text-(--fg-muted)"
          >
            {tag}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {revealed && <MosaicReveal bgClass="bg-blue-500" />}
      </AnimatePresence>
    </article>
  )
}

function StickyPanel({ currentIndex }: { currentIndex: number }) {
  const exp = experiences[currentIndex]
  const textRotateRef = useRef<TextRotateRef>(null)

  useEffect(() => {
    textRotateRef.current?.jumpTo(currentIndex)
  }, [currentIndex])

  return (
    <div className="flex h-full flex-col justify-center pr-12">
      <span className="mb-6 font-pixel text-3xl tracking-widest text-(--accent)">
        // Where I&apos;ve worked
      </span>

      <div className="overflow-hidden">
        <TextRotate
          ref={textRotateRef}
          texts={experiences.map((e) => e.company)}
          auto={false}
          loop={false}
          splitBy="characters"
          staggerFrom="first"
          staggerDuration={0.025}
          animatePresenceMode="wait"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          mainClassName="font-pixel text-6xl xl:text-7xl text-(--fg) leading-tight flex-wrap"
          splitLevelClassName="overflow-hidden"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-1"
        >
          <p className="text-base font-medium text-(--fg)">{exp.location}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 w-full">
        <div className="flex items-center gap-3">
          {experiences.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === currentIndex ? 40 : 10,
                backgroundColor: i === currentIndex ? "var(--accent)" : "var(--border)",
              }}
              transition={{ duration: 0.3 }}
              className="h-2.5 rounded-full"
            />
          ))}
          <span className="ml-2 font-pixel text-sm text-(--fg-muted)">
            {String(currentIndex + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
          </span>
        </div>

        <div
          aria-hidden
          className={`pointer-events-none mt-4 h-px w-full bg-linear-to-r ${exp.gradient} opacity-60`}
        />
      </div>
    </div>
  )
}

export function Experience() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleInView = useCallback((index: number, inView: boolean) => {
    if (inView) setCurrentIndex(index)
  }, [])

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      {/* Mobile heading */}
      <div className="md:hidden">
        <SectionHeading eyebrow="// Where I've worked" title="Experience" />
      </div>

      {/* Desktop: sticky left + scrollable right */}
      <div className="hidden md:flex gap-0">
        <div className="w-5/12 lg:w-[42%]">
          <div className="sticky top-24 h-[calc(100vh-6rem)]">
            <StickyPanel currentIndex={currentIndex} />
          </div>
        </div>

        <div className="w-7/12 lg:w-[58%]">
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.company} exp={exp} index={i} onInView={handleInView} />
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-6 md:hidden">
        {experiences.map((exp) => (
          <MobileCard key={exp.company} exp={exp} />
        ))}
      </div>
    </section>
  )
}
