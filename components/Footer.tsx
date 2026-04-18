import { SiGithub, SiSubstack } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { socialLinks } from "@/lib/data";
import { GmailPill } from "./GmailPill";

const iconLinks = [
  { label: "GitHub", href: socialLinks.github, Icon: SiGithub },
  { label: "LinkedIn", href: socialLinks.linkedin, Icon: FaLinkedin },
  { label: "Substack", href: socialLinks.substack, Icon: SiSubstack },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          {iconLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href || undefined}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Icon size={16} />
            </a>
          ))}
          <GmailPill />
        </div>
        <p className="text-center text-sm text-[var(--fg-muted)]">
          © 2026 Ding Ren. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
