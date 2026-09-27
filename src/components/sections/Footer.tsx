import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { SITE } from "@/lib/seo";

const SOCIAL_ICONS: Record<string, Icon> = {
  LinkedIn: LinkedinLogo,
  GitHub: GithubLogo,
};

const EXPLORE = [
  { label: "AI Products", href: "#ai-systems" as const },
  { label: "Experience", href: "#experience" as const },
  { label: "Side Project", href: "#side-project" as const },
  { label: "Collections", href: "#showcase" as const },
  { label: "Services", href: "#services" as const },
  { label: "FAQs", href: "#faq" as const },
];

const linkClass =
  "text-sm text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200";

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
                  aria-label={`${social.label} profile for Gwee Per Ming`}
                  className="rounded-sm text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200"
                >
                  <IconComponent aria-hidden="true" weight="regular" className="size-5" />
                </a>
              );
            })}
          </div>
          <p className="mt-7 text-base font-semibold tracking-tight text-white">Gwee Per Ming</p>
          <p className="mt-1 text-sm text-zinc-300">Ming Creatives · creative studio</p>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
            I build AI systems and software. Ming Creatives is my separate
            studio identity for web experiences, 3D animation, AI workflow
            automation, and generative-AI creative work.
          </p>
          <p className="mt-6 text-xs text-zinc-500">
            © {year} Gwee Per Ming · Malaysia
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
            Engineering teams can explore my systems, experience, and public
            profiles. Creative clients can start a project with Ming Creatives.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer me" className={linkClass}>
              Engineering profile
            </a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Creative inquiry
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
