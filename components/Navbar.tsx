"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#", disabled: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#home"
          className="font-pixel text-2xl tracking-tight text-[var(--fg)] hover:text-[var(--accent)] transition"
        >
          Ding Ren
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-disabled={item.disabled || undefined}
              className={`px-3 py-2 font-pixel text-xl transition ${
                item.disabled
                  ? "cursor-not-allowed text-[var(--fg-muted)]/60"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              {item.label}
            </a>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)]"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-disabled={item.disabled || undefined}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                  else setOpen(false);
                }}
                className={`py-2 font-pixel text-xl ${
                  item.disabled
                    ? "cursor-not-allowed text-[var(--fg-muted)]/60"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
