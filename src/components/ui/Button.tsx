import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  showArrow?: boolean;
}

export function Button({
  href,
  children,
  variant = "primary",
  showArrow = false,
}: ButtonProps) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-white text-zinc-950 hover:bg-zinc-200"
      : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/10";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
      {showArrow && (
        <ArrowRight
          weight="bold"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}
