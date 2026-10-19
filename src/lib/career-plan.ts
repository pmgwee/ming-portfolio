/**
 * Data for the 职业规划表 (Career Plan) tool.
 * The full tool lives at /product/career-plan (static page in /public) and
 * reads the same localStorage key, so the home-page demo can hand answers over.
 */
export const CAREER_PLAN_URL = "/product/career-plan";
export const CAREER_PLAN_STORE = "tenyear-plan-v1";

export type Lang = "en" | "cn";
export type Text = { en: string; cn: string };
export type Answer = boolean | null;

export type Role = {
  id: string;
  name: Text;
  /** Stepping stones from today toward the goal (goal itself excluded). */
  path: [Text, Text, Text];
  /** What this goal usually demands. */
  skills: [Text, Text, Text];
};

export type Industry = { id: string; name: Text; roles: Role[] };

const t = (en: string, cn: string): Text => ({ en, cn });

export const INDUSTRIES: Industry[] = [
  {
    id: "tech",
    name: t("Tech & AI", "科技与 AI"),
    roles: [
      { id: "ai-lead", name: t("AI Engineering Lead", "AI 工程负责人"), path: [t("Software Engineer", "软件工程师"), t("ML Engineer", "机器学习工程师"), t("Senior AI Engineer", "资深 AI 工程师")], skills: [t("Python & machine learning", "Python 与机器学习"), t("MLOps & deployment", "MLOps 与部署"), t("System design", "系统设计")] },
      { id: "head-data", name: t("Head of Data", "数据负责人"), path: [t("Data Analyst", "数据分析师"), t("Data Scientist", "数据科学家"), t("Senior Data Scientist", "资深数据科学家")], skills: [t("SQL & statistics", "SQL 与统计"), t("Machine learning", "机器学习"), t("Data storytelling", "用数据讲故事")] },
      { id: "product-director", name: t("Product Director", "产品总监"), path: [t("Associate PM", "助理产品经理"), t("Product Manager", "产品经理"), t("Senior PM", "资深产品经理")], skills: [t("User research", "用户研究"), t("Data-driven decisions", "数据驱动决策"), t("Roadmapping", "产品路线规划")] },
      { id: "regional-tech", name: t("Regional Tech Lead", "区域技术负责人"), path: [t("Software Engineer", "软件工程师"), t("Senior Engineer", "资深工程师"), t("Engineering Manager", "技术经理")], skills: [t("Architecture", "架构设计"), t("Team leadership", "团队管理"), t("Cross-border communication", "跨国沟通")] },
    ],
  },
  {
    id: "business",
    name: t("Business & Finance", "商业与金融"),
    roles: [
      { id: "finance-director", name: t("Finance Director", "财务总监"), path: [t("Audit / Accounts Associate", "审计 / 会计专员"), t("Financial Analyst", "财务分析师"), t("Finance Manager", "财务经理")], skills: [t("Financial modelling", "财务建模"), t("Reporting & compliance", "报表与合规"), t("Business partnering", "业务伙伴思维")] },
      { id: "investment-manager", name: t("Investment Manager", "投资经理"), path: [t("Investment Analyst", "投资分析师"), t("Associate", "投资经理助理"), t("Vice President", "副总裁")], skills: [t("Valuation", "估值"), t("Market research", "市场研究"), t("Deal negotiation", "交易谈判")] },
      { id: "consulting-manager", name: t("Consulting Manager", "咨询经理"), path: [t("Business Analyst", "商业分析师"), t("Consultant", "顾问"), t("Senior Consultant", "资深顾问")], skills: [t("Structured problem-solving", "结构化解决问题"), t("Client presentation", "客户提案"), t("Industry expertise", "行业专长")] },
      { id: "ops-director", name: t("Operations Director", "运营总监"), path: [t("Operations Executive", "运营专员"), t("Operations Manager", "运营经理"), t("Senior Ops Manager", "资深运营经理")], skills: [t("Process improvement", "流程优化"), t("Supply chain", "供应链"), t("People management", "团队管理")] },
    ],
  },
  {
    id: "creative",
    name: t("Marketing & Creative", "营销与创意"),
    roles: [
      { id: "marketing-director", name: t("Marketing Director", "市场总监"), path: [t("Marketing Executive", "市场专员"), t("Marketing Manager", "市场经理"), t("Senior Marketing Manager", "资深市场经理")], skills: [t("Performance marketing", "效果营销"), t("Brand strategy", "品牌策略"), t("Budget ownership", "预算管理")] },
      { id: "creative-director", name: t("Creative Director", "创意总监"), path: [t("Designer", "设计师"), t("Senior Designer", "资深设计师"), t("Art Director", "艺术指导")], skills: [t("Visual storytelling", "视觉叙事"), t("AI creative tools", "AI 创意工具"), t("Leading creative teams", "带领创意团队")] },
      { id: "creator", name: t("Full-time Content Creator", "全职内容创作者"), path: [t("Part-time creator", "兼职创作者"), t("Niche creator", "垂直领域创作者"), t("Creator with brand deals", "有品牌合作的创作者")], skills: [t("Short-video production", "短视频制作"), t("Audience growth", "粉丝增长"), t("Brand partnerships", "品牌合作")] },
      { id: "ux-lead", name: t("UX Lead", "用户体验负责人"), path: [t("UI/UX Designer", "UI/UX 设计师"), t("Product Designer", "产品设计师"), t("Senior Product Designer", "资深产品设计师")], skills: [t("User research", "用户研究"), t("Interaction design", "交互设计"), t("Design systems", "设计系统")] },
    ],
  },
  {
    id: "health",
    name: t("Healthcare & Science", "医疗与科研"),
    roles: [
      { id: "specialist", name: t("Medical Specialist", "专科医生"), path: [t("House Officer", "实习医生"), t("Medical Officer", "医疗官"), t("Specialist Trainee", "专科培训医生")], skills: [t("Clinical expertise", "临床专业"), t("Postgraduate exams", "专科考试"), t("Patient communication", "医患沟通")] },
      { id: "pharmacy-manager", name: t("Pharmacy Manager", "药剂经理"), path: [t("Provisional Pharmacist", "实习药剂师"), t("Pharmacist", "药剂师"), t("Senior Pharmacist", "资深药剂师")], skills: [t("Clinical pharmacy", "临床药学"), t("Regulatory affairs", "法规事务"), t("Team management", "团队管理")] },
      { id: "research-scientist", name: t("Research Scientist", "研究科学家"), path: [t("Research Assistant", "研究助理"), t("PhD Researcher", "博士研究员"), t("Postdoctoral Scientist", "博士后科学家")], skills: [t("Research methods", "研究方法"), t("Publications & grants", "论文与经费申请"), t("Lab / data skills", "实验 / 数据能力")] },
      { id: "healthcare-admin", name: t("Healthcare Operations Manager", "医疗运营经理"), path: [t("Admin Executive", "行政专员"), t("Unit Manager", "部门主管"), t("Operations Manager", "运营经理")], skills: [t("Healthcare operations", "医疗运营"), t("Compliance", "合规"), t("Leadership", "领导力")] },
    ],
  },
  {
    id: "founder",
    name: t("Founder & Independent", "创业与自由职业"),
    roles: [
      { id: "startup-founder", name: t("Startup Founder", "自己创业"), path: [t("Early startup employee", "初创公司早期员工"), t("Side project with paying users", "有付费用户的副业"), t("Co-founder", "联合创始人")], skills: [t("Sales & fundraising", "销售与融资"), t("Product-market fit", "产品市场匹配"), t("Hiring", "招聘与组队")] },
      { id: "studio-owner", name: t("Studio / Agency Owner", "工作室老板"), path: [t("Freelancer", "自由职业者"), t("Freelancer with retainer clients", "有长期客户的自由职业者"), t("Small team lead", "小团队负责人")], skills: [t("Portfolio & personal brand", "作品集与个人品牌"), t("Pricing & contracts", "定价与合同"), t("Client management", "客户管理")] },
      { id: "ecommerce-founder", name: t("E-commerce Brand Founder", "电商品牌创始人"), path: [t("Marketplace seller", "平台卖家"), t("Own-brand seller", "自有品牌卖家"), t("Multi-channel brand", "多渠道品牌")], skills: [t("Product sourcing", "选品与采购"), t("Performance ads", "投放广告"), t("Operations & logistics", "运营与物流")] },
      { id: "independent-consultant", name: t("Independent Consultant", "独立顾问"), path: [t("Industry specialist", "行业专员"), t("Senior expert", "资深专家"), t("Trusted advisor", "受信赖的顾问")], skills: [t("Deep expertise", "深度专业"), t("Personal brand", "个人品牌"), t("Network & referrals", "人脉与转介绍")] },
    ],
  },
];

const ALL_ROLES = INDUSTRIES.flatMap((industry) => industry.roles);

/** Match free text (either language) to a known role. */
export function findRole(input: string): Role | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;
  return (
    ALL_ROLES.find((role) => role.name.en.toLowerCase() === q || role.name.cn === q) ??
    ALL_ROLES.find((role) => q.includes(role.name.en.toLowerCase()) || role.name.en.toLowerCase().includes(q) || q.includes(role.name.cn)) ??
    null
  );
}

/** A path for goals we don't have a template for. */
export const GENERIC_ROLE: Omit<Role, "id" | "name"> = {
  path: [t("Entry role in the field", "该领域的入门职位"), t("Specialist", "专业岗位"), t("Senior / Lead", "资深 / 负责人")],
  skills: [t("Core skills of the field", "该领域的核心技能"), t("Leadership", "领导力"), t("Industry network", "行业人脉")],
};

export const JOB_QUESTIONS: { q: Text; hint: Text; insight: Text }[] = [
  {
    q: t("Will it teach the skills I need in the next 1–3 years?", "能学到 1–3 年后需要的技能吗？"),
    hint: t("Compare it with the skills your goal needs", "对照你的目标需要的技能"),
    insight: t("It won't build your next skills. Ask about training budgets or rotations, or pair it with a side project.", "这份工补不上你需要的技能。问问培训预算或轮岗机会，或者配一个副业项目。"),
  },
  {
    q: t("Will I meet the people and resources I need?", "能接触到我需要的人脉 / 资源吗？"),
    hint: t("Colleagues, clients, industry circles, the company's platform", "同事、客户、行业圈子、公司平台"),
    insight: t("Your network won't grow here. Plan one industry event or coffee chat a month outside work.", "这里扩展不了你的人脉。每个月在工作以外安排一次行业活动或 coffee chat。"),
  },
  {
    q: t("Does it play to my strengths?", "能发挥我的优势吗？"),
    hint: t("Where you could reach the top 5% without burning out", "在擅长的地方，不用拼命也可能做到前 5%"),
    insight: t("You'd be working against your strengths. Check whether the daily tasks match what you're best at.", "你会在弱项上硬撑。看看日常工作内容是否符合你最擅长的事。"),
  },
  {
    q: t("Will this role still matter in 5–10 years?", "这个岗位 5–10 年后还在吗？"),
    hint: t("Look at seniors in the field: is AI replacing their work?", "看看业内 senior：AI 会取代他们的工作吗？"),
    insight: t("This role may shrink in the AI era. See how seniors in it are adapting before you commit.", "这个岗位在 AI 时代可能缩水。先看看业内前辈怎么转型，再决定。"),
  },
  {
    q: t("Is the title a stepping stone to my next role?", "这个 title 能当我下一站的跳板吗？"),
    hint: t("In the job market, people read your position title first", "打工的世界，大家先看你的 position title"),
    insight: t("The title won't open the next door. Ask what roles people moved into after two years.", "这个 title 打不开下一扇门。问问这里的人两年后都去了哪些职位。"),
  },
];

export type Verdict = { tone: "go" | "mid" | "no" | "none"; label: Text; detail: Text };

export function verdictFor(answers: Answer[]): Verdict {
  if (answers.every((a) => a === null)) return { tone: "none", label: t("Not rated", "未评估"), detail: t("Answer the 5 questions", "回答 5 个问题") };
  const score = answers.filter((a) => a === true).length;
  if (score >= 4) return { tone: "go", label: t("Take it", "去"), detail: t("It's moving you toward your goal", "它在帮你走向终点") };
  if (score >= 2) return { tone: "mid", label: t("Stepping stone", "当跳板"), detail: t("Take it, but set a date to move on", "可以去，但写下离开日期") };
  return { tone: "no", label: t("Can't get you there", "给不了"), detail: t("However good the pay, it's time you won't get back", "薪水再高，也是在白做") };
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
