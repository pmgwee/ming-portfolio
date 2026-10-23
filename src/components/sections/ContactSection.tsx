"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Coffee, FileText, ChatCircle } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { contactEmailDraft, validateContact, type ContactDetails, type ContactErrors } from "@/lib/contact";

const COPY = SITE.contact;
const EMPTY: ContactDetails = { name: "", email: "", company: "", role: "", message: "" };
const ICONS = { coffee: Coffee, opportunity: ChatCircle, resume: FileText };
const FIELDS = ["name", "email", "company", "role", "message"] as const;
const INPUT = "mt-2 block min-h-11 w-full rounded-md border border-white/20 bg-[#07080c] px-4 py-2.5 text-base text-zinc-100 caret-brand-200 placeholder:text-zinc-400 focus:border-brand-200 focus:outline-2 focus:outline-offset-2 focus:outline-brand-200 aria-invalid:border-red-300";

/** Local extension of DESIGN.md: dark editorial invitation, three quiet topic choices,
 * one form. Native controls and topic-specific handoffs; no decorative card grid,
 * invented delivery service, automatic booking or public résumé download. */
export function ContactSection() {
  const [topic, setTopic] = useState<"coffee" | "opportunity" | "resume">("resume");
  const [details, setDetails] = useState<ContactDetails>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [draftOpened, setDraftOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function selectTopic(value: typeof topic) {
    setTopic(value);
    setErrors({});
    setDraftOpened(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (topic === "coffee") return;
    const nextErrors = validateContact(details, topic);
    setErrors(nextErrors);
    const firstError = FIELDS.find((field) => nextErrors[field]);
    if (firstError) {
      (formRef.current?.elements.namedItem(firstError) as HTMLElement | null)?.focus();
      return;
    }
    const draft = contactEmailDraft(COPY.email, topic, details);
    if (!draft) return;
    setDraftOpened(true);
    window.location.href = draft;
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 border-t border-white/10 bg-[#07080c] px-6 py-12 selection:bg-brand-200 selection:text-[#07080c] md:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <header className="grid items-end gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <h2 id="contact-heading" className="max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,3rem)] font-medium leading-[1.08] tracking-[-0.03em] text-zinc-100">{COPY.title}</h2>
          <p className="max-w-[54ch] text-base leading-relaxed text-zinc-300">{COPY.description}</p>
        </header>

          <fieldset className="mt-5 grid min-w-0 border-y border-white/15 md:grid-cols-3">
            <legend className="sr-only">What would you like to discuss?</legend>
            {COPY.topics.map((item) => {
              const Icon = ICONS[item.id];
              return <label key={item.id} className="group relative flex cursor-pointer items-center gap-3 border-b border-white/15 py-4 last:border-b-0 md:border-b-0 md:px-5 md:first:pl-0 md:last:pr-0">
                <input type="radio" name="contact-topic" value={item.id} checked={topic === item.id} onChange={() => selectTopic(item.id)} className="peer sr-only" aria-controls="contact-panel" />
                <Icon aria-hidden="true" className={`size-6 shrink-0 ${topic === item.id ? "text-brand-200" : "text-zinc-400"}`} />
                <span className="min-w-0 flex-1"><span className="block text-base font-medium text-zinc-100">{item.title}</span><span className="mt-1 block text-sm leading-relaxed text-zinc-400">{item.description}</span></span>
                <span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-200 ${topic === item.id ? "border-brand-200 bg-brand-200" : "border-white/30 group-hover:border-white/60"}`}><span className={`size-2 rounded-full ${topic === item.id ? "bg-[#07080c]" : "bg-transparent"}`} /></span>
              </label>;
            })}
          </fieldset>

        <div id="contact-panel" className="mt-5 rounded-md border border-white/10 bg-[#101219] p-6">
          {topic === "coffee" ? <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <div>
              <Coffee aria-hidden="true" className="mb-4 size-8 text-brand-200" />
              <h3 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-100">{COPY.coffeeTitle}</h3>
              <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-zinc-300">{COPY.coffeeDescription}</p>
            </div>
            <div>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-zinc-100 px-6 py-3 font-semibold text-[#07080c] transition-colors hover:bg-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200">{COPY.coffeeCta}<ArrowUpRight aria-hidden="true" className="size-5" /></a>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-zinc-400">{COPY.coffeeNote}</p>
            </div>
          </div> : <form ref={formRef} noValidate onSubmit={submit}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="text-2xl font-semibold tracking-[-0.025em] text-zinc-100">{COPY.topics.find((item) => item.id === topic)?.title}</h3>
              <p className="text-sm text-zinc-400"><span className="text-red-300" aria-hidden="true">*</span> {COPY.required}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{topic === "resume" ? COPY.resumeNote : COPY.opportunityNote}</p>
            <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-10">
              {FIELDS.map((field) => {
                const required = ["name", "email", "message"].includes(field) || topic === "resume";
                const id = `contact-${field}`;
                const common = { id, name: field, required, value: details[field], "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `${id}-error` : undefined, maxLength: field === "message" ? 2000 : field === "email" ? 254 : 160, className: INPUT, placeholder: COPY.placeholders[field], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setDetails((prev) => ({ ...prev, [field]: e.target.value }));
                  setDraftOpened(false);
                  if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
                } };
                return <div key={field} className={`min-w-0 ${field === "message" ? "sm:col-span-2 lg:col-span-4 lg:col-start-7 lg:row-start-1 lg:row-span-2 lg:flex lg:flex-col" : "lg:col-span-3"}`}>
                  <label htmlFor={id} className="block text-sm font-medium text-zinc-200">{COPY.labels[field]}{required ? <span className="ml-1 text-red-300" aria-hidden="true">*</span> : <span className="ml-2 font-normal text-zinc-400">{COPY.optional}</span>}</label>
                  {field === "message" ? <textarea {...common} rows={4} className={`${INPUT} min-h-32 resize-y lg:flex-1`} /> : <input {...common} type={field === "email" ? "email" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "off"} />}
                  {errors[field] ? <p id={`${id}-error`} className="mt-2 text-sm text-red-300">{errors[field]}</p> : null}
                </div>;
              })}
            </div>
            {Object.values(errors).some(Boolean) ? <p role="alert" className="mt-5 text-sm text-red-300">Please complete the highlighted fields before opening your draft.</p> : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-6 rounded-full bg-zinc-100 px-6 py-3 font-semibold text-[#07080c] transition-colors hover:bg-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200">{COPY.emailCta}<ArrowUpRight aria-hidden="true" className="size-5" /></button>
              <p className="max-w-[56ch] text-sm leading-relaxed text-zinc-400">{COPY.emailNote}</p>
            </div>
            {draftOpened ? <p role="status" className="mt-4 text-sm leading-relaxed text-brand-200">{COPY.draftNotice}</p> : null}
            <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm leading-relaxed lg:flex-row lg:justify-between lg:gap-6">
              <p><span className="text-zinc-400">{COPY.directEmail} </span><a href={`mailto:${COPY.email}`} className="break-all text-brand-200 underline decoration-brand-200/40 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200">{COPY.email}</a></p>
              <p className="text-zinc-400">{COPY.privacy}</p>
            </div>
          </form>}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200">{COPY.profile}</a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-200">{COPY.studio}</a>
        </div>
      </div>
    </section>
  );
}
