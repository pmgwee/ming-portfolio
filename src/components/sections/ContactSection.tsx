"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Coffee, FileText, ChatCircle } from "@phosphor-icons/react";
import { SITE } from "@/lib/seo";
import { contactEmailDraft, validateContact, type ContactDetails, type ContactErrors } from "@/lib/contact";

const COPY = SITE.contact;
const EMPTY: ContactDetails = { name: "", email: "", company: "", role: "", message: "" };
const ICONS = { coffee: Coffee, opportunity: ChatCircle, resume: FileText };
const FIELDS = ["name", "email", "company", "role", "message"] as const;
const INPUT = "mt-2 w-full rounded-xl border border-white/20 bg-[#07080c] px-4 py-3 text-base text-zinc-100 caret-indigo-200 placeholder:text-zinc-400 focus:border-indigo-200 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-200 aria-invalid:border-red-300";

/** Local extension of DESIGN.md: dark editorial invitation, three quiet topic rows,
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
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-28 border-t border-white/10 bg-[#07080c] px-6 py-24 selection:bg-indigo-200 selection:text-[#07080c] md:px-10 md:py-32">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <h2 id="contact-heading" className="max-w-[13ch] text-balance text-[clamp(2.5rem,4.5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-zinc-100">{COPY.title}</h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-zinc-300">{COPY.description}</p>

          <fieldset className="mt-10 min-w-0 border-t border-white/15">
            <legend className="sr-only">What would you like to discuss?</legend>
            {COPY.topics.map((item) => {
              const Icon = ICONS[item.id];
              return <label key={item.id} className="group relative flex cursor-pointer items-center gap-4 border-b border-white/15 py-5">
                <input type="radio" name="contact-topic" value={item.id} checked={topic === item.id} onChange={() => selectTopic(item.id)} className="peer sr-only" aria-controls="contact-panel" />
                <Icon aria-hidden="true" className={`size-6 shrink-0 ${topic === item.id ? "text-indigo-200" : "text-zinc-400"}`} />
                <span className="min-w-0 flex-1"><span className="block text-lg font-medium text-zinc-100">{item.title}</span><span className="mt-1 block text-sm leading-relaxed text-zinc-400">{item.description}</span></span>
                <span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-indigo-200 ${topic === item.id ? "border-indigo-200 bg-indigo-200" : "border-white/30 group-hover:border-white/60"}`}><span className={`size-2 rounded-full ${topic === item.id ? "bg-[#07080c]" : "bg-transparent"}`} /></span>
              </label>;
            })}
          </fieldset>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200">{COPY.profile}</a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200">{COPY.studio}</a>
          </div>
        </div>

        <div id="contact-panel" className="self-start rounded-2xl border border-white/10 bg-[#101219] p-6 sm:p-8 lg:p-10">
          {topic === "coffee" ? <div>
            <Coffee aria-hidden="true" className="size-8 text-indigo-200" />
            <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-zinc-100">{COPY.coffeeTitle}</h3>
            <p className="mt-4 max-w-[43ch] text-base leading-relaxed text-zinc-300">{COPY.coffeeDescription}</p>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-zinc-100 px-6 py-3 font-semibold text-[#07080c] transition-colors hover:bg-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200">{COPY.coffeeCta}<ArrowUpRight aria-hidden="true" className="size-5" /></a>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{COPY.coffeeNote}</p>
          </div> : <form ref={formRef} noValidate onSubmit={submit}>
            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-zinc-100">{COPY.topics.find((item) => item.id === topic)?.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{topic === "resume" ? COPY.resumeNote : COPY.opportunityNote}</p>
            <p className="mt-4 text-sm text-zinc-400"><span className="text-red-300" aria-hidden="true">*</span> {COPY.required}</p>
            <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
              {FIELDS.map((field) => {
                const required = ["name", "email", "message"].includes(field) || topic === "resume";
                const id = `contact-${field}`;
                const common = { id, name: field, required, value: details[field], "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `${id}-error` : undefined, maxLength: field === "message" ? 2000 : field === "email" ? 254 : 160, className: INPUT, placeholder: COPY.placeholders[field], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setDetails((prev) => ({ ...prev, [field]: e.target.value }));
                  setDraftOpened(false);
                  if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
                } };
                return <div key={field} className={`min-w-0 ${field === "message" ? "sm:col-span-2" : ""}`}>
                  <label htmlFor={id} className="text-sm font-medium text-zinc-200">{COPY.labels[field]}{required ? <span className="ml-1 text-red-300" aria-hidden="true">*</span> : <span className="ml-2 font-normal text-zinc-400">{COPY.optional}</span>}</label>
                  {field === "message" ? <textarea {...common} rows={4} className={`${INPUT} min-h-36 resize-y`} /> : <input {...common} type={field === "email" ? "email" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "off"} />}
                  {errors[field] ? <p id={`${id}-error`} className="mt-2 text-sm text-red-300">{errors[field]}</p> : null}
                </div>;
              })}
            </div>
            {Object.values(errors).some(Boolean) ? <p role="alert" className="mt-5 text-sm text-red-300">Please complete the highlighted fields before opening your draft.</p> : null}
            <button type="submit" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-6 rounded-full bg-zinc-100 px-6 py-3 font-semibold text-[#07080c] transition-colors hover:bg-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200 sm:w-auto">{COPY.emailCta}<ArrowUpRight aria-hidden="true" className="size-5" /></button>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{COPY.emailNote}</p>
            {draftOpened ? <p role="status" className="mt-4 text-sm leading-relaxed text-indigo-200">{COPY.draftNotice}</p> : null}
            <div className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed">
              <span className="text-zinc-400">{COPY.directEmail} </span><a href={`mailto:${COPY.email}`} className="break-all text-indigo-200 underline decoration-indigo-200/40 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-200">{COPY.email}</a>
              <p className="mt-2 text-zinc-400">{COPY.privacy}</p>
            </div>
          </form>}
        </div>
      </div>
    </section>
  );
}
