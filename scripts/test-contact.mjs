import assert from "node:assert/strict";
import { contactEmailDraft, validateContact } from "../src/lib/contact.ts";
import { SITE } from "../src/lib/seo.ts";

const details = { name: "Alex Tan", email: "alex@example.com", company: "Example & Co", role: "AI Engineer", message: "Hello Ming,\nCould we discuss a role?" };
const url = new URL(contactEmailDraft(SITE.contact.email, "resume", details));
assert.equal(url.protocol, "mailto:");
assert.equal(url.pathname, "perminggwee@gmail.com");
assert.equal(url.searchParams.get("subject"), "Résumé request — Alex Tan");
assert.ok(url.searchParams.get("body").includes("Reply to: alex@example.com"));
assert.ok(url.searchParams.get("body").includes("Company / organisation: Example & Co"));
assert.ok(url.searchParams.get("body").includes("Role: AI Engineer"));
for (const field of Object.keys(details)) {
  assert.equal(contactEmailDraft(SITE.contact.email, "resume", { ...details, [field]: "  " }), null, `${field} required for résumé requests`);
}
assert.deepEqual(validateContact({ ...details, company: "", role: "" }, "opportunity"), {});
for (const email of ["bad", "a@b", "a b@example.com", "a@example.com\r\nBcc:evil@example.com"]) {
  assert.ok(validateContact({ ...details, email }, "resume").email);
}
const cn = new URL(contactEmailDraft(SITE.contact.email, "opportunity", { ...details, name: "小明 & Alex", message: "你好，聊一聊 AI？\n时间：周五 3pm" }));
assert.equal(cn.searchParams.get("subject"), "Opportunity enquiry — 小明 & Alex");
assert.ok(cn.searchParams.get("body").includes("你好，聊一聊 AI？"));
assert.equal([...cn.searchParams.keys()].length, 2, "User text cannot introduce mail headers");
assert.ok(validateContact({ ...details, message: "x".repeat(2001) }, "resume").message);
assert.equal(SITE.whatsapp, "https://wa.me/message/DFUGF3HXISNEF1", "Coffee chats retain the approved contact");
console.log("PASS: recruiter routing, required fields, optional opportunity context, safe bilingual email drafts and existing WhatsApp destination.");
