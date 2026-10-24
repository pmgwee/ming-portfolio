import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { SITE } from "@/lib/seo";

const SOCIAL_ICONS: Record<string, Icon> = {
  Instagram: InstagramLogo,
};

const EXPLORE = [
  { label: "Creative work", href: "#showcase" as const },
  { label: "Product", href: "#career-plan" as const },
  { label: "Services", href: "#services" as const },
  { label: "Engineering", href: "#career" as const },
  { label: "AI Projects", href: "/ai-projects" as const },
  { label: "Experiences", href: "/experiences" as const },
  { label: "Side Projects", href: "/side-projects" as const },
  { label: "FAQs", href: "#faq" as const },
];

const linkClass =
  "text-sm text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#07080c] px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 md:grid-cols-[1.2fr_0.8fr_1fr] md:gap-10">
        <div>
          <div className="flex items-center gap-5">
            {SITE.socials.map((social) => {
              const IconComponent = SOCIAL_ICONS[social.label];
              if (!IconComponent) return null;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`${SITE.name} on ${social.label}`}
                  className="rounded-sm text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200"
                >
                  <IconComponent aria-hidden="true" weight="regular" className="size-5" />
                </a>
              );
            })}
          </div>
          <p className="mt-7 text-base font-semibold tracking-tight text-white">{SITE.name}</p>
          <p className="mt-1 text-sm text-zinc-300">{SITE.jobTitle} · {SITE.handle}</p>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
            A Malaysian content creator sharing photography, AI films, and the
            creative tech behind them: immersive web, 3D animation, and AI
            agents.
          </p>
          <p className="mt-6 text-xs text-zinc-500">
            © {year} {SITE.name} · {SITE.nationality}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <AnchorLink href={item.href} className={linkClass}>
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">The right conversation</h2>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-zinc-400">
            Brands and creators can start a collaboration with Ming Creatives.
            Recruiters can explore the AI projects and experience.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Collaboration inquiry
            </a>
            <AnchorLink href="/ai-projects" className={linkClass}>
              AI projects
            </AnchorLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
