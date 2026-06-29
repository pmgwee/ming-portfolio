"use client";

import {
  BehanceLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  ThreadsLogo,
  XLogo,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { scrollToHash } from "@/lib/smooth-scroll";

/**
 * Site footer — social icon row + brand/description on the left, Explore links
 * on the right, with the © line tucked under the description.
 *
 * Doubles as an SEO/GEO surface: it's where the exact brand ("Ming Creatives")
 * and real name ("Perming Gwee") appear in visible body text, and every profile
 * link carries `rel="me"` to reinforce the same-entity signal the JSON-LD
 * `sameAs` declares.
 */

// Brand icons for the social row (Xiaohongshu has no icon → omitted here).
const SOCIAL_ICONS: Record<string, Icon> = {
  LinkedIn: LinkedinLogo,
  GitHub: GithubLogo,
  Behance: BehanceLogo,
  Instagram: InstagramLogo,
  Threads: ThreadsLogo,
  X: XLogo,
};

const EXPLORE = [
  { label: "Collection", href: "#showcase" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "FAQ", href: "#faq" },
];

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white">
      {children}
    </h3>
  );
}

const linkCls = "text-sm text-zinc-400 transition-colors hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#07080c] px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-14 md:flex-row md:justify-between md:gap-10">
          {/* Left — social icons + brand + description + © line */}
          <div className="max-w-sm">
            <div className="flex items-center gap-5">
              {SITE.socials.map((s) => {
                const LogoIcon = SOCIAL_ICONS[s.label];
                if (!LogoIcon) return null;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={s.label}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    <LogoIcon weight="regular" className="size-5" />
                  </a>
                );
              })}
            </div>

            <div className="mt-8 font-mono text-lg font-semibold tracking-tight text-white">
              Ming <span className="text-indigo-400">Creatives</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Awwwards-level 3D animated websites | Generative Ai
              <br />
              Based in {SITE.geo.city}, {SITE.geo.region}, {SITE.location} — also
              serving {SITE.geo.nearbyTowns.join(" & ")}, working worldwide.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              © {year} Ming Creatives · {SITE.personName}
            </p>
          </div>

          {/* Middle — Explore links */}
          <div className="flex flex-col gap-4">
            <ColTitle>Explore</ColTitle>
            <ul className="flex flex-col gap-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(l.href);
                    }}
                    className={linkCls}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — start a project CTA */}
          <div className="flex flex-col gap-4">
            <ColTitle>Start a project</ColTitle>
            <p className="max-w-[22ch] text-sm leading-relaxed text-zinc-400">
              Ready to build something that stops the scroll?
            </p>
            <a
              href="https://wa.me/message/DFUGF3HXISNEF1"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/4 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              Let&apos;s build yours
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
