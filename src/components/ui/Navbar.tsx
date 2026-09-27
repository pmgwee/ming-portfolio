"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { SITE } from "@/lib/seo";

const LINKS = [
  { label: "AI Products", href: "#ai-systems" as const },
  { label: "Experience", href: "#experience" as const },
  { label: "Side Project", href: "#side-project" as const },
  { label: "Collections", href: "#showcase" as const },
  { label: "Services", href: "#services" as const },
];

const linkClass =
  "rounded-sm text-sm text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-2 sm:px-4">
      <nav
        aria-label="Main navigation"
        className={`mx-auto mt-3 w-full max-w-[1400px] rounded-2xl px-3 py-3 transition-colors duration-300 sm:rounded-full sm:px-5 ${
          scrolled || menuOpen
            ? "border border-white/15 bg-[#07080c]/90 shadow-xl backdrop-blur-2xl"
            : "border border-white/10 bg-black/20 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <AnchorLink
            href="#top"
            className="flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
            onNavigate={() => setMenuOpen(false)}
          >
            <Image
              src="/logo-resized.png"
              alt=""
              width={28}
              height={28}
              className="shrink-0 rounded-md"
              priority
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">
                Gwee Per Ming
              </span>
              <span className="block text-[11px] text-zinc-400">Ming Creatives</span>
            </span>
          </AnchorLink>

          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((link) => (
              <AnchorLink key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </AnchorLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-10 items-center gap-1 rounded-full bg-white px-3 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200 sm:gap-1.5 sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">Inquiry</span>
              <span className="hidden sm:inline">Studio inquiry</span>
              <ArrowUpRight aria-hidden="true" weight="bold" className="size-3.5" />
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200 lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" size={20} /> : <List aria-hidden="true" size={20} />}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          hidden={!menuOpen}
          className="border-t border-white/10 pt-3 lg:hidden"
        >
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <AnchorLink
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-200"
                  onNavigate={() => setMenuOpen(false)}
                >
                  {link.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <AnchorLink
                href="#contact"
                className="block rounded-lg px-3 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-200"
                onNavigate={() => setMenuOpen(false)}
              >
                Recruiter & client routes
              </AnchorLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
