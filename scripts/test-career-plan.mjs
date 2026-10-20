import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { INDUSTRIES, findRole, verdictFor, handOffToFullTool, CAREER_PLAN_STORE } from "../src/lib/career-plan.ts";
import { CAREER_EVIDENCE } from "../src/lib/career-evidence.ts";
import { nextMoveFor } from "../src/lib/career-next-move.ts";

const roles = INDUSTRIES.flatMap((industry) => industry.roles);
assert.equal(roles.length, 20);
assert.equal(new Set(roles.map((role) => role.id)).size, 20);
for (const role of roles) {
  assert.equal(findRole(role.name.en)?.id, role.id);
  assert.equal(findRole(role.name.cn)?.id, role.id);
  const evidence = CAREER_EVIDENCE[role.id];
  assert.ok(evidence, `Missing evidence: ${role.id}`);
  for (const field of [evidence.shift, evidence.experiment, evidence.ask, evidence.caveat]) {
    assert.ok(field.en && field.cn, `Missing translation: ${role.id}`);
  }
  assert.ok(evidence.sources.length > 0);
  for (const source of evidence.sources) {
    assert.equal(new URL(source.url).protocol, "https:");
    assert.ok(source.finding.en && source.finding.cn && source.scope.en && source.scope.cn);
  }
  assert.equal("years" in role, false, "Unsupported timeline remains");
}
for (const vague of ["", "Director", "AI", "Senior", "总监", "Unlisted custom role"]) assert.equal(findRole(vague), null);

// Test the actual static tool's scoring function too, without a browser or a new dependency.
const html = readFileSync(new URL("../public/product/career-plan/index.html", import.meta.url), "utf8");
const fn = html.match(/  function verdict\(j\) \{[\s\S]*?\n  \}/)?.[0];
assert.ok(fn);
const labels = Object.fromEntries(["none", "go", "mid", "no"].map((key) => [key, [key, key]]));
const context = vm.createContext({ L: { verdict: labels } });
vm.runInContext(`const score = j => j.answers.filter(a => a === true).length;
  const answered = j => j.answers.filter(a => a !== null).length;
  ${fn}; globalThis.check = answers => verdict({answers}).cls;`, context);
for (let n = 0; n < 243; n++) {
  let index = n;
  const answers = Array.from({ length: 5 }, () => { const answer = [null, false, true][index % 3]; index = Math.floor(index / 3); return answer; });
  const yes = answers.filter((a) => a === true).length;
  const expected = answers.includes(null) ? "none" : yes >= 4 ? "go" : yes >= 2 ? "mid" : "no";
  assert.equal(verdictFor(answers).tone, expected);
  assert.equal(context.check(answers), `v-${expected}`);
}
for (const malformed of [[], [true], [true, true, true, true, undefined]]) assert.equal(verdictFor(malformed).tone, "none");

let saved = JSON.stringify({ goal: { why: "Preserve my reasons" }, plan: { y1: { role: "My existing plan" } }, jobs: [{name:"old"},{name:"Keep B"},{name:"Keep current"}] });
globalThis.localStorage = { getItem: () => saved, setItem: (key, value) => { assert.equal(key, CAREER_PLAN_STORE); saved = value; } };
handOffToFullTool({ name: "QA", role: "AI Engineering Lead", jobName: "Example job", answers: [true, false, null, true, null], lang: "cn" });
const result = JSON.parse(saved);
assert.equal(result.goal.why, "Preserve my reasons");
assert.equal(result.plan.y1.role, "My existing plan");
assert.equal(result.jobs[1].name, "Keep B");
assert.equal(result.lang, "cn");
assert.equal(result.jobs[0].answers[2], null);
// Prioritise gaps, keep unknowns distinct, and let the visitor override the focus.
assert.equal(nextMoveFor([true, null, false, true, null]).index, 2);
assert.equal(nextMoveFor([true, null, false, true, null], 1).state, 0);
assert.equal(nextMoveFor([true, true, true, true, true]).index, 4);
assert.equal(nextMoveFor([null, null, null, null, null]).state, 0);
console.log("PASS: 20 bilingual evidence profiles; 243 answer states in both tools; exact role matching; handoff preserves existing plans.");
