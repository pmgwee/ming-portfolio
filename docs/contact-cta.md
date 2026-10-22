# Contact CTA extension

## Overview

This is a narrow, built extension of the established portfolio, not a new visual world.
Root `PRODUCT.md` remains product truth; root `DESIGN.md` remains the global visual authority.
This note records only contact-specific decisions and does not redefine global tokens.

The user requested a CTA immediately after CareerSection’s three engineering cards.
The reference screenshot supplied the purpose—coffee, opportunities, and résumé requests—
while the implementation uses the current site’s minimalist styling, not the screenshot’s visual system.

## Layout

`src/app/page.tsx` mounts `CareerSection` → `ContactSection` → `FaqSection`.
ContactSection replaces the previously mounted AudiencePaths and owns the homepage’s single `#contact` anchor.
The existing CareerSection cards and unrelated sections are unchanged by this extension.

The section is restrained, dark, and editorial: a shared invitation header, three topic choices,
then one full-width response panel. This replaces the unequal sidebar/form composition that
left empty space for coffee and pushed the email action below the viewport.
Desktop choices share a row. The four short fields occupy a two-by-two group beside the message,
with equal lower edges and the action and disclosures beneath. Short fields pair from the small
breakpoint; below desktop, the message follows them at full width. Mobile choices stack.
Compact contact-specific spacing targets a complete resting-state desktop composition in one
viewport without reducing body type or touch targets. Small screens, zoom, errors, resized
messages, and draft notices expand naturally; there are no fixed heights or nested scrollers.
Fine rules, quiet icons, and existing pill actions supply hierarchy without another decorative card grid.
The contact surface has no entrance animation or motion-dependent content.

## Components

### Sources of truth

- `src/components/sections/ContactSection.tsx`: client-side topic selection, fields, validation feedback, and handoffs.
- `src/lib/contact.ts`: `validateContact`, typed details/errors, and `contactEmailDraft`.
- `src/lib/seo.ts`: `SITE.contact` owns contact copy, topic descriptions, labels, placeholders, notices, and recipient.
- Existing `SITE.whatsapp` and `SITE.linkedin` remain the route sources; do not create parallel destinations.

### Topics and routes

Native, labelled radios in a fieldset select Coffee chat, An opportunity, or Résumé request.
Résumé request is selected initially. Switching topics clears validation errors and draft status,
but retains entered details in component memory.

- Coffee swaps the form for a conversational invitation and opens the exact existing `SITE.whatsapp`: `https://wa.me/message/DFUGF3HXISNEF1`. It makes no automatic booking.
- Opportunity opens a `mailto:` draft to `SITE.contact.email`, `perminggwee@gmail.com`.
- Résumé request uses the same email draft route for recruiters and hiring managers; no public résumé download is offered.
- Supporting links retain the engineering profile via `SITE.linkedin` and studio inquiries via `SITE.whatsapp`.

### Form contract

Name, valid email, and message are required for both email topics.
Company / organisation and role are required only for résumé requests; both are optional for opportunities.
Whitespace-only required values fail validation. Limits are 160 characters for name/company/role,
254 for email, and 2,000 for message, enforced by input limits and the validation helper.

The form uses custom validation with `noValidate`; required attributes remain on the controls.
An invalid submission focuses the first error in name → email → company → role → message order.
Field errors use `aria-invalid` and linked descriptions; an alert summarizes the need to complete fields.
Controls have visible keyboard focus, explicit labels, and native radio keyboard behavior.

Valid details become an encoded subject/body with context and reply-to text; no mail headers are added from user input.
`contactEmailDraft` returns `null` for invalid details. It does not submit to a server.
“Open email draft” asks the visitor to review and send in their own email app.
The status explicitly says nothing was sent by the website and offers direct email if the app did not open.
That notice records an attempted handoff, not confirmed mail-client launch or delivery.
Details stay in component memory only: no storage, server submission, or website delivery service.

## Review and verification

The original full review matched the requested extension except for placeholder contrast.
The sole fix is now scored resolved: placeholders use the existing quiet-text treatment at approximately 7.6:1 contrast.
That resolved defect is not a new global token or permission to retain low-contrast placeholders elsewhere.

Recorded implementation verification: `node scripts/test-contact.mjs` and the production build passed.
The tests cover recruiter routing, required/optional context, email validation, encoded bilingual drafts,
message limits, and preservation of the approved WhatsApp destination.
No external test email was sent. These recorded results were not rerun for this documentation-only pass.

The subsequent viewport-alignment fix was verified against the user's rejected split-layout
screenshots. At 1280 × 800, the complete resting résumé composition, including the heading,
three topics, five fields, action, disclosures and supporting links, fits beneath navigation.
At 1024px and 1840px widths the paired inputs and message share their top/bottom edges with
no horizontal overflow. At 390px the form stacks without overflow; invalid opportunity
submission focuses Name and flags Name, Email and Message. Coffee retains its exact WhatsApp
destination; opportunity context remains optional. Contact tests, TypeScript, the production
build and the layout-scoped detector passed again for this fix.
