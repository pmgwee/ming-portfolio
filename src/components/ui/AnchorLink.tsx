"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export function AnchorLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: `#${string}`;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        scrollToHash(href);
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
