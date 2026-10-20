import type { Answer, Text } from "./career-plan";

const t = (en: string, cn: string): Text => ({ en, cn });

/** These states describe the user's answers, not measured career readiness. */
export const OPPORTUNITY_STATES = [
  { label: t("Check", "待确认"), description: t("Ask before assuming", "先问清楚") },
  { label: t("Build", "需补足"), description: t("Make a plan for the gap", "为差距安排下一步") },
  { label: t("Use", "可发挥"), description: t("Turn access into experience", "把条件变成经验") },
] as const;

export const OPPORTUNITY_AREAS = [
  {
    label: t("Skills", "技能"),
    why: t("Learning only helps when you can use it on real work.", "能在真实任务中运用，学习才会变成经验。"),
    check: t("Ask which project you would own in your first 90 days, and which skill it would develop.", "问清入职前 90 天会负责什么项目，以及能练习哪项技能。"),
    build: t("Choose one missing skill from your goal. Agree on a small project or a protected learning slot to practise it.", "从目标技能中选一项差距，争取一个小项目或固定学习时段来练习。"),
    use: t("Turn one upcoming task into a documented case study: the problem, your decision and the result.", "把下一项任务整理成案例：问题、你的判断，以及最后的结果。"),
  },
  {
    label: t("People", "人脉"),
    why: t("Access matters when it leads to feedback, context or collaboration.", "能带来反馈、行业认知或合作，人脉才会产生价值。"),
    check: t("Ask who would review your work and how often you would work together.", "问问谁会评审你的工作，以及多久能合作或交流一次。"),
    build: t("Find one practitioner in your target role. Bring a specific work sample and ask for feedback on one decision.", "找一位目标岗位的从业者，带上具体作品，请对方评价其中一个判断。"),
    use: t("Book a short review with someone you can learn from. Ask what separates good work from work they would trust you to own.", "约一位值得学习的人做简短评审，问清什么样的成果能让对方放心交给你负责。"),
  },
  {
    label: t("Strengths", "优势"),
    why: t("A good title can hide a working week that does not suit you.", "合适的头衔，也可能包含不适合你的日常工作。"),
    check: t("Ask for a typical week's tasks. Mark which ones use your strengths and which ones drain your energy.", "了解典型一周的任务，标出哪些能发挥优势，哪些让你消耗精力。"),
    build: t("Keep a five-day task and energy log. Use it to discuss a different mix of responsibilities or compare another role.", "记录五天的任务与精力变化，用它讨论职责调整，或比较另一个岗位。"),
    use: t("Pick a recurring task that suits you. Improve its process and capture the difference it makes for the team.", "选一项适合你的常规任务，改进流程，并记录它给团队带来的变化。"),
  },
  {
    label: t("Transferability", "可迁移性"),
    why: t("A useful skill should be explainable outside one company's tools and titles.", "有价值的技能，应当能脱离一家公司的工具和头衔被解释清楚。"),
    check: t("Compare three adjacent vacancies. Highlight skills they share with the work you would do here.", "比较三个相邻岗位的招聘要求，找出与这份工作共通的技能。"),
    build: t("Describe one task in terms of judgement, process and outcome. Practise the same method on a second problem.", "用判断、方法和结果描述一项任务，再把同一方法用到另一个问题上。"),
    use: t("Write a short story showing how your approach worked in two different contexts. Keep the decisions and trade-offs visible.", "整理一个简短案例，展示同一方法如何用于两种情境，并说明判断和取舍。"),
  },
  {
    label: t("Proof of work", "成果"),
    why: t("Your next conversation becomes stronger when you can show what changed because of your work.", "能展示你的工作带来了什么变化，下一次职业对话才更有说服力。"),
    check: t("Ask what good performance looks like and what results you could document without sharing confidential work.", "问清优秀表现的标准，以及哪些成果可以在不泄露机密的情况下记录。"),
    build: t("Agree on one small deliverable and how it will be reviewed. Save your starting point so you can explain what improved.", "约定一项小交付与评审方式，记录起点，方便说明后来改进了什么。"),
    use: t("Package one result into a one-page case study. Include your contribution, the evidence and what you would improve next.", "把一项成果整理成一页案例，写清你的贡献、证据和下一次的改进方向。"),
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

/** A user-controlled time budget, not an estimate of time to career success. */
export function weeklyTime(hours: number) {
  const safeHours = Number.isFinite(hours) ? Math.max(1, Math.min(8, Math.round(hours))) : 3;
  const total = safeHours * 60;
  const define = Math.round(total * 0.2);
  const make = Math.round(total * 0.6);
  return { hours: safeHours, total, define, make, review: total - define - make };
}
