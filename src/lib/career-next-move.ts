import type { Answer, Text } from "./career-plan";

const t = (en: string, cn: string): Text => ({ en, cn });

/** Completion celebrates a finished preview; the copy follows the answers. */
export function completionFor(goal: string, answers: Answer[]) {
  if (!goal.trim() || answers.length !== 5 || answers.some((answer) => typeof answer !== "boolean")) return null;
  const score = answers.filter((answer) => answer === true).length;
  if (score >= 4) return {
    tone: "go" as const,
    first: t("This could be", "你的下一步，"),
    second: t("your next big move.", "大有可为。"),
  };
  if (score >= 2) return {
    tone: "mid" as const,
    first: t("Big goal.", "目标够大。"),
    second: t("Let's close the gaps.", "下一步要更准。"),
  };
  return {
    tone: "no" as const,
    first: t("Your goal.", "目标已清晰。"),
    second: t("More ways forward.", "打开更多可能。"),
  };
}

/** These states describe the user's answers, not measured career readiness. */
export const OPPORTUNITY_STATES = [
  { label: t("Check", "待确认") },
  { label: t("Build", "需补足") },
  { label: t("Use", "可发挥") },
] as const;

export const OPPORTUNITY_AREAS = [
  {
    label: t("Skills", "技能"),
    check: t("Ask what your first project would teach you.", "问清第一个项目能让你学到什么。"),
    build: t("Find one project to practise a missing skill.", "用一个小项目，补上一项关键技能。"),
    use: t("Turn one project into a case study.", "把一个项目，变成你的代表作。"),
  },
  {
    label: t("People", "人脉"),
    check: t("Find out who you would learn from.", "了解你能向谁学习。"),
    build: t("Get feedback from someone in your target role.", "找一位目标岗位的从业者，听听反馈。"),
    use: t("Make feedback a regular conversation.", "让交流和反馈成为习惯。"),
  },
  {
    label: t("Strengths", "优势"),
    check: t("Compare a typical week's tasks with your strengths.", "看看一周的日常工作，是否适合你的优势。"),
    build: t("Ask for work that plays to your strengths.", "争取更能发挥优势的任务。"),
    use: t("Take ownership of work you do well.", "在擅长的领域，争取更多主导权。"),
  },
  {
    label: t("Transferability", "可迁移性"),
    check: t("Look for skills shared by three adjacent roles.", "找出三个相邻岗位都需要的技能。"),
    build: t("Practise one skill you can use across roles.", "练好一项能跨岗位运用的技能。"),
    use: t("Show how your skills work in another context.", "展示你的技能如何用于另一种情境。"),
  },
  {
    label: t("Proof of work", "成果"),
    check: t("Ask which results you could document and share.", "问清哪些成果可以记录与展示。"),
    build: t("Choose one small result you can demonstrate.", "先做出一项拿得出手的小成果。"),
    use: t("Bring your strongest result to your next conversation.", "下一次职业对话，带上最有说服力的成果。"),
  },
] as const;

export function opportunityState(answer: Answer | undefined): 0 | 1 | 2 {
  return answer === true ? 2 : answer === false ? 1 : 0;
}

export function nextMoveFor(answers: Answer[], selected: number | null = null) {
  const gap = answers.findIndex((answer) => answer === false);
  const unknown = answers.findIndex((answer) => answer !== true && answer !== false);
  const priority = gap >= 0 ? gap : unknown >= 0 ? unknown : 4;
  const index = selected !== null && Number.isInteger(selected) && selected >= 0 && selected < 5 ? selected : priority;
  const area = OPPORTUNITY_AREAS[index];
  const state = opportunityState(answers[index]);
  return { index, area, state, action: state === 0 ? area.check : state === 1 ? area.build : area.use };
}
