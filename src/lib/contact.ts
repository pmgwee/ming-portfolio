export type RecruitmentTopic = "opportunity" | "resume";
export type ContactDetails = {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
};
export type ContactErrors = Partial<Record<keyof ContactDetails, string>>;

export function validateContact(details: ContactDetails, topic: RecruitmentTopic): ContactErrors {
  const errors: ContactErrors = {};
  if (!details.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = "Please enter a valid email address.";
  if (topic === "resume" && !details.company.trim()) errors.company = "Include the company you’re recruiting for.";
  if (topic === "resume" && !details.role.trim()) errors.role = "Include the role you’re hiring for.";
  if (!details.message.trim()) errors.message = "Add a little context for your enquiry.";
  for (const key of Object.keys(details) as (keyof ContactDetails)[]) {
    const limit = key === "message" ? 2000 : key === "email" ? 254 : 160;
    if (details[key].length > limit) errors[key] = `Keep this under ${limit} characters.`;
  }
  return errors;
}

/** A draft only. Delivery remains the visitor's explicit action in their email app. */
export function contactEmailDraft(recipient: string, topic: RecruitmentTopic, details: ContactDetails): string | null {
  if (Object.keys(validateContact(details, topic)).length) return null;
  const title = topic === "resume" ? "Résumé request" : "Opportunity enquiry";
  const subject = `${title} — ${details.name.trim().replace(/[\r\n]+/g, " ")}`;
  const body = [
    `Hi Ming,`, "", details.message.trim(), "",
    `Name: ${details.name.trim()}`,
    `Reply to: ${details.email.trim()}`,
    details.company.trim() ? `Company / organisation: ${details.company.trim()}` : "",
    details.role.trim() ? `Role: ${details.role.trim()}` : "",
  ].filter((line, i, all) => line || (i > 0 && all[i - 1])).join("\r\n");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
