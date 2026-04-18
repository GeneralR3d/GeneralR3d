"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Experience } from "@/lib/data"

const COLS = 14
const ROWS = 10

export function ExperienceCard({ exp }: { exp: Experience }) {
  const [revealed, setRevealed] = useState(false)

  const cellDelays = useMemo(
    () => Array.from({ length: COLS * ROWS }, () => Math.random() * 0.55),
    []
  )

  return (
    <article
      className="group relative cursor-pointer select-none overflow-hidden rounded-2xl border border-(--border) bg-(--bg-elev) p-6 transition hover:border-(--accent)"
      onClick={() => setRevealed((v) => !v)}
    >
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

      {/* Mosaic image reveal */}
      <AnimatePresence>
        {revealed && (
          <div className="absolute inset-0 z-10">
            {/* Placeholder — swap for <Image> later */}
            <div className="absolute inset-0 bg-blue-500" />

            {/* Mosaic cells dissolve to reveal image */}
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
        )}
      </AnimatePresence>
    </article>
  )
}
