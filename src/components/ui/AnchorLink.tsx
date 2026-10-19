"use client";

import Link from "next/link";
import { navigateWithTransition } from "@/lib/page-transition";
import { scrollToHash } from "@/lib/smooth-scroll";

/**
 * In-page section link (`#id`) with smooth scrolling, or a route link (`/path`).
 * A `#id` whose section is not on the current page (e.g. on /ai-projects)
 * goes to that section on the home page, behind the page-transition cover.
 */
export function AnchorLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: `#${string}` | `/${string}`;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={() => onNavigate?.()}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
        const onPage = href === "#" || href === "#top" ? window.location.pathname === "/" : document.querySelector(href);
        if (!onPage) {
          navigateWithTransition(href === "#" || href === "#top" ? "/" : `/${href}`);
          return;
        }
        scrollToHash(href);
      }}
    >
      {children}
    </a>
  );
}
