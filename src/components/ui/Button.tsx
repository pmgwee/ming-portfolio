"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { scrollToHash } from "@/lib/smooth-scroll";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  showArrow?: boolean;
  target?: string;
  rel?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  showArrow = false,
  target,
  rel,
}: ButtonProps) {
  const base =
    "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200";
  const styles =
    variant === "primary"
      ? "bg-white text-zinc-950 hover:bg-zinc-200"
      : "border border-white/25 bg-black/40 text-white hover:bg-white/10";

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${base} ${styles}`}
      onClick={href.startsWith("#") ? (event) => {
        event.preventDefault();
        scrollToHash(href);
      } : undefined}
    >
      {children}
      {showArrow && (
        <ArrowRight
          aria-hidden="true"
          weight="bold"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
