import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../public/product/career-plan/index.html", import.meta.url), "utf8");
const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes('const STORE = "tenyear-plan-v1"'));
assert.ok(source);
const element = () => ({ style: {}, classList: { add() {}, remove() {} }, innerHTML: "", textContent: "", querySelectorAll: () => [], querySelector: (selector) => selector === "section" ? element() : null, insertAdjacentHTML() {}, setAttribute() {}, focus() {} });
const nodes = new Map();
let saved = null;
const context = vm.createContext({
  URLSearchParams, location: { search: "" }, navigator: { language: "en" },
  localStorage: { getItem: () => saved, setItem() {} }, setTimeout: () => 0, clearTimeout() {},
  window: { scrollTo() {}, matchMedia: () => ({ matches: false }) },
  document: { documentElement: element(), getElementById: (id) => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); }, querySelectorAll: () => [], querySelector: () => null, addEventListener() {} },
});
vm.runInContext(source.replace(/  render\(\);\s*\}\)\(\);\s*$/, `
  globalThis.form = { go, blank, example: EXAMPLE, state: () => S, replace: (s) => { S = s; L = T[s.lang] || T.en; }, render, stepErrors, firstIncomplete, viewReport, requireComplete, load };
})();`), context);
const form = context.form;
form.go(1);
form.go(2);
assert.equal(form.state().step, 1, "An empty required goal must block Next");
form.go(6);
assert.notEqual(form.state().step, 6, "A direct report jump must not bypass required fields");
const complete = () => { const s = form.example(); s.lang = "en"; s.none["now.network"] = true; return s; };
form.replace(complete());
assert.equal(form.firstIncomplete(), null);
for (let step = 1; step <= 5; step++) {
  form.state().step = step;
  form.go(step + 1);
  assert.equal(form.state().step, step + 1, `Complete step ${step} advances`);
}
const requiredText = ["goal.role", "goal.industry", "goal.day", "goal.life", "goal.why", "goal.edge", "now.role", "firstStep", ...["y10", "y5", "y3", "y1"].flatMap((k) => [`plan.${k}.role`, `plan.${k}.marker`]), ...[0, 1, 2].map((i) => `actions.${i}.what`)];
for (const path of requiredText) for (const bad of ["", "  ", null]) {
  const s = complete(); const keys = path.split("."); const last = keys.pop(); keys.reduce((o, k) => o[k], s)[last] = bad;
  form.replace(s);
  assert.ok(form.firstIncomplete(), `${path} rejects ${JSON.stringify(bad)}`);
  form.state().step = 5; form.go(6);
  assert.notEqual(form.state().step, 6, `${path} blocks report`);
}
for (const path of ["goal.criteria", "goal.strengths", ...["y10", "y5", "y3", "y1"].flatMap((k) => [`plan.${k}.skills`, `plan.${k}.network`])]) {
  const s = complete(); const keys = path.split("."); const last = keys.pop(); keys.reduce((o, k) => o[k], s)[last] = [" "];
  form.replace(s); assert.ok(form.firstIncomplete(), `${path} needs real items`);
}
for (const bad of [null, undefined, "true", "", 0]) {
  const s = complete(); s.jobs[1].answers[3] = bad; form.replace(s);
  assert.equal(form.firstIncomplete()?.step, 4, "All started jobs require 5 boolean answers, including hidden tabs");
}
for (const date of ["", "2020-01", "2099-12", "2026-13", "garbage"]) {
  const s = complete(); s.actions[1].by = date; form.replace(s);
  assert.equal(form.firstIncomplete()?.step, 5, `Invalid deadline ${date} rejected`);
}
const skipped = complete(); skipped.jobs = form.blank().jobs; form.replace(skipped);
assert.equal(form.firstIncomplete()?.step, 4, "No jobs must be explicitly acknowledged");
skipped.jobsSkipped = true;
assert.equal(form.firstIncomplete(), null, "No job is an honest supported state");
skipped.name = ""; skipped.none["now.skills"] = true; skipped.now.skills = [];
skipped.obstacles = []; skipped.none.obstacles = true;
for (const key of Object.keys(skipped.support)) skipped.support[key] = [];
skipped.none.support = true;
assert.equal(form.firstIncomplete(), null, "Optional name and explicit none answers remain valid");
for (const path of ["now.skills", "now.network", "obstacles", "support"]) {
  skipped.none[path] = false; assert.equal(form.firstIncomplete()?.step, 3); skipped.none[path] = true;
}
form.replace(complete()); form.state().step = 6; form.state().goal.day = " "; form.render();
assert.equal(form.state().step, 1, "An old incomplete report is reopened at its first missing step");
assert.equal(form.requireComplete(), false, "Exports reject incomplete reports");
saved = JSON.stringify({v:2, step:6, activeJob:99, goal:{role:null}, jobs:[null, {name:"Draft",answers:[true,null,"false"]}], actions:[null], now:{skills:[null," ","Python"]}});
form.replace(form.load());
assert.equal(form.state().jobs.length, 3);
assert.equal(form.state().jobs[1].answers.length, 5);
assert.equal(form.state().jobs[1].answers[2], null);
assert.equal(form.state().actions.length, 3);
assert.deepEqual([...form.state().now.skills], ["Python"]);
assert.doesNotThrow(() => form.render());
assert.equal(form.state().step, 1, "Malformed old draft returns to the first required step without crashing");
const cn = complete(); cn.lang = "cn"; cn.goal.role = " "; form.replace(cn);
assert.match(form.stepErrors(1)[0].message, /必填/);
console.log("PASS: step/report/export guards, whitespace/nulls, all milestones, conditional jobs, explicit none, deadlines and restored drafts.");
