/**
 * Shared shape for the 10年倒推表 (10-year backcast) tool.
 * The full tool lives at /product/career-plan (static page in /public) and
 * reads the same localStorage key, so the home-page demo can hand answers over.
 */
export const CAREER_PLAN_URL = "/product/career-plan";
export const CAREER_PLAN_STORE = "tenyear-plan-v1";

export const ROLE_SUGGESTIONS = ["Director", "Regional Tech Lead", "Senior Manager", "Consultant", "自己创业"];

export const JOB_QUESTIONS: { q: string; hint: string }[] = [
  { q: "能学到 1–3 年后需要的技能吗？", hint: "对照你通往终点必须补上的技能" },
  { q: "能接触到我需要的人脉 / 资源吗？", hint: "同事、客户、行业圈子、公司平台" },
  { q: "能发挥我的优势吗？", hint: "在擅长的地方，不用拼命也可能做到前 5%" },
  { q: "这个行业 / 岗位 5–10 年后还在吗？", hint: "在 AI 时代，业内 senior 会被取代吗？" },
  { q: "这个 title 能当我下一站的跳板吗？", hint: "打工的世界，最后看的是你的 position title" },
];

export type Answer = boolean | null;

export type Verdict = { tone: "go" | "mid" | "no" | "none"; label: string; detail: string };

export function verdictFor(answers: Answer[]): Verdict {
  if (answers.every((a) => a === null)) return { tone: "none", label: "未评估", detail: "回答左边 5 题" };
  const score = answers.filter((a) => a === true).length;
  if (score >= 4) return { tone: "go", label: "去", detail: "它在帮你走向终点" };
  if (score >= 2) return { tone: "mid", label: "当跳板", detail: "可以去，但写下离开日期" };
  return { tone: "no", label: "给不了", detail: "薪水再高，也是在白做" };
}

/** Merge the demo answers into the full tool's saved state and open it at step 1. */
export function handOffToFullTool(demo: { name: string; role: string; jobName: string; answers: Answer[] }) {
  let saved: Record<string, unknown> = {};
  try {
    saved = JSON.parse(localStorage.getItem(CAREER_PLAN_STORE) ?? "{}") ?? {};
  } catch {}
  const goal = { ...((saved.goal as object) ?? {}), role: demo.role };
  const blankJob = (label: string) => ({ label, name: "", answers: [null, null, null, null, null], leave: "" });
  const jobs = Array.isArray(saved.jobs) && saved.jobs.length === 3
    ? [...saved.jobs]
    : [blankJob("工作 A"), blankJob("工作 B"), blankJob("现在的工")];
  jobs[0] = { label: "工作 A", leave: "", ...(jobs[0] ?? {}), name: demo.jobName, answers: demo.answers };
  const next = { ...saved, v: 2, step: 1, name: demo.name || (saved.name as string) || "", goal, jobs };
  try {
    localStorage.setItem(CAREER_PLAN_STORE, JSON.stringify(next));
  } catch {}
}
