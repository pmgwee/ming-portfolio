import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { SITE } from "@/lib/seo";

export function AudiencePaths() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-28 border-t border-white/10 bg-[#07080c] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <h2
          id="contact-heading"
          className="max-w-[18ch] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-zinc-100"
        >
          What brings you here?
        </h2>

        <div className="mt-12 grid gap-12 border-t border-white/15 pt-8 md:grid-cols-2 md:gap-16">
          <article>
            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-zinc-100">
              Building an AI or software team?
            </h3>
            <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-zinc-300">
              Explore the systems, engineering contributions, experience, and
              education behind my current direction toward AI Engineer and
              AI/Data Consultant roles.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <AnchorLink
                href="#ai-systems"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 underline decoration-indigo-300/50 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
              >
                Explore AI products
                <ArrowUpRight aria-hidden="true" weight="bold" className="size-4" />
              </AnchorLink>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-sm font-semibold text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
              >
                LinkedIn profile
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-sm font-semibold text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
              >
                GitHub profile
              </a>
            </div>
          </article>

          <article className="md:border-l md:border-white/10 md:pl-10">
            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-zinc-100">
              Looking for a creative web studio?
            </h3>
            <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-zinc-300">
              Ming Creatives offers immersive web design, business websites and
              apps, AI workflow automation, and generative-AI creative
              production. Explore the work, then reach out to discuss a project.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <AnchorLink
                href="#showcase"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 underline decoration-indigo-300/50 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
              >
                Browse collections
                <ArrowUpRight aria-hidden="true" weight="bold" className="size-4" />
              </AnchorLink>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
              >
                Start a studio inquiry
                <ArrowUpRight aria-hidden="true" weight="bold" className="size-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
