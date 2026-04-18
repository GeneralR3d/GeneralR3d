"use client";

import { useEffect, useRef, useState } from "react";
import { SiGmail } from "react-icons/si";
import { Check } from "lucide-react";
import { socialLinks } from "@/lib/data";

export function GmailPill() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: no-op; the email stays visible for manual copy.
    }
  };

  return (
    <div
      ref={ref}
      className={`group inline-flex h-10 items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-elev)] transition-[width,border-color,background-color] duration-300 ease-out hover:border-[var(--accent)] ${
        expanded ? "w-[18rem] max-w-[90vw]" : "w-10"
      }`}
    >
      <button
        type="button"
        aria-label={expanded ? "Hide email" : "Show email"}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--fg)] transition hover:text-[var(--accent)]"
      >
        <SiGmail size={16} />
      </button>

      <div
        className={`flex h-full flex-1 items-center gap-2 pr-3 transition-opacity duration-200 ${
          expanded ? "opacity-100 delay-150" : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={copy}
          tabIndex={expanded ? 0 : -1}
          className="truncate font-[family-name:var(--font-pixel)] text-lg tracking-wide text-[var(--fg)] hover:text-[var(--accent)]"
        >
          {socialLinks.email}
        </button>
        {copied && (
          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-pixel)] text-sm text-[var(--accent)]">
            <Check size={14} /> copied
          </span>
        )}
      </div>
    </div>
  );
}
