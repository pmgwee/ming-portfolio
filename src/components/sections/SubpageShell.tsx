import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";

/** Layout for stand-alone section pages (/ai-projects, /experiences). */
export function SubpageShell({
  title,
  next,
  children,
}: {
  title: string;
  next: { href: string; label: string; hook: string };
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#07080c] pt-16">
      <h1 className="sr-only">{title}</h1>
      <Navbar />
      {children}
      <section className="border-t border-white/10 bg-[#07080c] px-6 py-16 md:px-10">
        <Link
          href={next.href}
          className="group mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 rounded-md border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200 md:p-10"
        >
          <span>
            <span className="text-sm font-medium text-brand-200">Keep exploring</span>
            <span className="mt-2 block text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] text-zinc-100">
              {next.label}
            </span>
            <span className="mt-2 block max-w-[60ch] text-sm text-zinc-400">{next.hook}</span>
          </span>
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-zinc-100 text-[#07080c] transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight aria-hidden="true" weight="bold" className="size-6" />
          </span>
        </Link>
      </section>
      <Footer />
    </main>
  );
}
