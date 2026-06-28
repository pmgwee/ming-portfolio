"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] px-4">
      <nav
        className={`mx-auto mt-4 flex max-w-[1100px] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border border-white/10 bg-black/50 backdrop-blur-2xl backdrop-saturate-150"
            : "border border-transparent"
        }`}
      >
        <Link
          href="#"
          className="font-mono text-sm font-semibold tracking-tight text-white"
        >
          ming<span className="text-indigo-400">.</span>creatives
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <a
          href="https://wa.me/message/DFUGF3HXISNEF1"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-all duration-300 hover:bg-zinc-200"
        >
          Let&apos;s talk
          <ArrowUpRight
            weight="bold"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </nav>
    </header>
  );
}
