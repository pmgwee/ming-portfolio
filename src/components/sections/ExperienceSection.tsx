import { EXPERIENCE, EDUCATION } from "@/lib/experience";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-28 border-t border-white/10 bg-[#0b0c12] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-indigo-200">Experience / Education</p>
          <h2
            id="experience-heading"
            className="mt-3 text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100"
          >
            Where I&apos;ve worked
          </h2>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-zinc-300 md:text-lg">
            Engineering delivery at iFAST, creative production at Yierming, and
            experience working across teams. Yierming Production is separate
            from Ming Creatives.
          </p>
        </div>

        <div className="mt-12 border-t border-white/15">
          {EXPERIENCE.map((entry) => (
            <article
              key={`${entry.organization}-${entry.role}`}
              className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] md:gap-12 md:py-10"
            >
              <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100">
                    {entry.role}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    {entry.organization}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                <p className="mt-3 font-mono text-xs text-zinc-400">
                  {entry.dates}
                </p>
              </div>
              <ul className="list-disc space-y-4 pl-5 text-sm leading-relaxed text-zinc-300 marker:text-indigo-300 md:text-base">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}

          <div className="grid gap-6 pt-10 md:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] md:gap-12">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100">
              Education
            </h3>
            <div className="space-y-6">
              {EDUCATION.map((item) => (
                <article
                  key={item.institution}
                  className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">
                      {item.qualification}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">
                      {item.institution}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-zinc-500">
                    {item.dates}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
