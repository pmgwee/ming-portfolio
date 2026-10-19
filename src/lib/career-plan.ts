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
  /** Typical experience before reaching the goal, only where a source gives it. */
  years?: Text;
};

export type Industry = { id: string; name: Text; roles: Role[] };

const t = (en: string, cn: string): Text => ({ en, cn });

/*
 * Paths, skills and timings were checked in Oct 2026 against official
 * Malaysian pathways, salary guides, career guides and real LinkedIn
 * experience timelines (see CAREER_SOURCES). Years appear only when sourced.
 */
export const INDUSTRIES: Industry[] = [
  {
    id: "tech",
    name: t("Tech & AI", "科技与 AI"),
    roles: [
      { id: "ai-lead", name: t("AI Engineering Lead", "AI 工程负责人"), path: [t("Software Engineer", "软件工程师"), t("ML / AI Engineer", "机器学习 / AI 工程师"), t("Senior AI Engineer", "资深 AI 工程师")], skills: [t("LLM apps & retrieval (RAG)", "LLM 应用与检索 (RAG)"), t("MLOps & deployment", "MLOps 与部署"), t("System design", "系统设计")] },
      { id: "head-data", name: t("Head of Data", "数据负责人"), path: [t("Data Analyst / Engineer", "数据分析师 / 工程师"), t("Data Scientist / Senior Data Engineer", "数据科学家 / 资深数据工程师"), t("Analytics / Data Lead", "数据分析负责人")], skills: [t("Data strategy & governance", "数据策略与治理"), t("Machine learning & analytics", "机器学习与分析"), t("Leading data teams", "带领数据团队")], years: t("8–12 years, faster at startups", "8–12 年，初创公司更快") },
      { id: "product-director", name: t("Product Director", "产品总监"), path: [t("Business Analyst / Associate PM", "商业分析师 / 助理产品经理"), t("Product Owner / Product Manager", "产品负责人 / 产品经理"), t("Senior Product Manager", "资深产品经理")], skills: [t("Product strategy", "产品策略"), t("Cross-functional leadership", "跨部门领导"), t("Data-driven decisions", "数据驱动决策")], years: t("8–11 years", "8–11 年") },
      { id: "regional-tech", name: t("Regional Tech Lead", "区域技术负责人"), path: [t("Senior Engineer", "资深工程师"), t("Tech Lead", "技术主管"), t("Engineering Manager", "技术经理")], skills: [t("Architecture", "架构设计"), t("Leading teams across countries", "带领跨国团队"), t("Stakeholder alignment", "跨部门协调")] },
    ],
  },
  {
    id: "business",
    name: t("Business & Finance", "商业与金融"),
    roles: [
      { id: "finance-director", name: t("Finance Director", "财务总监"), path: [t("Audit Associate (0–2 yrs)", "审计专员（0–2 年）"), t("Senior Accountant / FP&A (5–9 yrs)", "资深会计 / 财务分析（5–9 年）"), t("Finance Manager (10+ yrs)", "财务经理（10 年以上）")], skills: [t("ACCA / MIA qualification", "ACCA / MIA 专业资格"), t("Financial planning & analysis", "财务规划与分析"), t("Business partnering", "业务伙伴思维")], years: t("15+ years", "15 年以上") },
      { id: "investment-director", name: t("Investment Director", "投资总监"), path: [t("Investment Analyst", "投资分析师"), t("Associate", "投资经理"), t("Vice President", "副总裁")], skills: [t("Financial modelling & valuation", "财务建模与估值"), t("Due diligence", "尽职调查"), t("Deal sourcing & negotiation", "项目开发与谈判")], years: t("8–11 years", "8–11 年") },
      { id: "consulting-manager", name: t("Consulting Manager", "咨询经理"), path: [t("Business Analyst", "商业分析师"), t("Consultant / Associate", "顾问"), t("Senior Consultant", "资深顾问")], skills: [t("Structured problem-solving", "结构化解决问题"), t("Client presentation", "客户提案"), t("Industry expertise", "行业专长")] },
      { id: "supply-chain-manager", name: t("Supply Chain Manager", "供应链经理"), path: [t("Supply Chain Coordinator / Logistics Analyst", "供应链专员 / 物流分析师"), t("Planner / Buyer", "计划员 / 采购员"), t("Assistant Manager", "助理经理")], skills: [t("Demand & supply planning", "需求与供应计划"), t("Procurement & supplier management", "采购与供应商管理"), t("ERP & data analysis", "ERP 与数据分析")] },
    ],
  },
  {
    id: "creative",
    name: t("Marketing & Creative", "营销与创意"),
    roles: [
      { id: "marketing-director", name: t("Marketing Director", "市场总监"), path: [t("Marketing Executive", "市场专员"), t("Marketing Manager", "市场经理"), t("Associate Director", "副总监")], skills: [t("Digital & performance marketing", "数字与效果营销"), t("Brand strategy", "品牌策略"), t("Budget & P&L ownership", "预算与损益管理")], years: t("12–15 years", "12–15 年") },
      { id: "creative-director", name: t("Creative Director", "创意总监"), path: [t("Designer / Junior Art Director", "设计师 / 初级艺术指导"), t("Art Director", "艺术指导"), t("Senior Art Director", "资深艺术指导")], skills: [t("Visual storytelling", "视觉叙事"), t("AI creative tools", "AI 创意工具"), t("Leading creative teams", "带领创意团队")], years: t("5–10+ years", "5–10 年以上") },
      { id: "creator", name: t("Full-time Content Creator", "全职内容创作者"), path: [t("Part-time creator", "兼职创作者"), t("Niche creator with a steady audience", "有稳定粉丝的垂直创作者"), t("Creator with brand deals", "有品牌合作的创作者")], skills: [t("Short-video production", "短视频制作"), t("Audience growth", "粉丝增长"), t("Brand deals & tax basics", "品牌合作与报税常识")] },
      { id: "ux-lead", name: t("UX Lead", "用户体验负责人"), path: [t("UX / UI Designer", "UX / UI 设计师"), t("Product Designer", "产品设计师"), t("Senior UX Designer", "资深 UX 设计师")], skills: [t("User research & storytelling", "用户研究与叙事"), t("Design systems", "设计系统"), t("Hiring & mentoring", "招聘与带人")] },
    ],
  },
  {
    id: "health",
    name: t("Healthcare & Science", "医疗与科研"),
    roles: [
      { id: "specialist", name: t("Medical Specialist", "专科医生"), path: [t("House Officer (2 yrs)", "实习医生（2 年）"), t("Medical Officer", "医疗官"), t("Specialist training (Master's / Parallel Pathway)", "专科培训（硕士 / 平行路径）")], skills: [t("Clinical competence", "临床能力"), t("Specialist exams", "专科考试"), t("Patient communication", "医患沟通")] },
      { id: "pharmacy-manager", name: t("Pharmacy Manager", "药剂经理"), path: [t("Provisionally Registered Pharmacist (~1 yr)", "实习药剂师 PRP（约 1 年）"), t("Fully Registered Pharmacist", "注册药剂师"), t("Senior / Licensed Pharmacist", "资深 / 持牌药剂师")], skills: [t("Clinical pharmacy", "临床药学"), t("Poisons Act & licensing", "毒药法令与执照"), t("Team & inventory management", "团队与库存管理")] },
      { id: "research-scientist", name: t("Research Scientist", "研究科学家"), path: [t("Research Assistant (Master's)", "研究助理（硕士）"), t("PhD Researcher", "博士研究员"), t("Postdoc / Scientist", "博士后 / 科学家")], skills: [t("Research methods", "研究方法"), t("Publications & grants", "论文与经费申请"), t("Project management & collaboration", "项目管理与协作")] },
      { id: "hospital-gm", name: t("Hospital General Manager", "医院总经理"), path: [t("Admin / Operations Executive", "行政 / 运营专员"), t("Clinic / Unit Manager", "诊所 / 部门经理"), t("Operations Manager", "运营经理")], skills: [t("Healthcare operations", "医疗运营"), t("Compliance & accreditation", "合规与认证"), t("Leadership & decision-making", "领导与决策")] },
    ],
  },
  {
    id: "founder",
    name: t("Founder & Independent", "创业与自由职业"),
    roles: [
      { id: "startup-founder", name: t("Startup Founder", "自己创业"), path: [t("Early employee at a startup", "初创公司早期员工"), t("Side project with paying users", "有付费用户的副业"), t("Co-founder", "联合创始人")], skills: [t("Sales & fundraising", "销售与融资"), t("Product-market fit", "产品市场匹配"), t("Hiring", "招聘与组队")] },
      { id: "studio-owner", name: t("Studio / Agency Owner", "工作室老板"), path: [t("Freelancer", "自由职业者"), t("Freelancer with retainer clients", "有长期客户的自由职业者"), t("First hire / small team", "第一个员工 / 小团队")], skills: [t("Portfolio & personal brand", "作品集与个人品牌"), t("Contracts & documented processes", "合同与标准流程"), t("Client management", "客户管理")] },
      { id: "ecommerce-founder", name: t("E-commerce Brand Founder", "电商品牌创始人"), path: [t("Marketplace seller (Shopee / TikTok Shop)", "平台卖家（Shopee / TikTok Shop）"), t("Own-brand seller", "自有品牌卖家"), t("Multi-channel brand", "多渠道品牌")], skills: [t("Product sourcing", "选品与采购"), t("Performance ads", "投放广告"), t("Inventory & fulfilment across channels", "多渠道库存与履约")] },
      { id: "independent-consultant", name: t("Independent Consultant", "独立顾问"), path: [t("Industry specialist", "行业专员"), t("Senior expert", "资深专家"), t("First clients from your network", "从人脉中拿到第一批客户")], skills: [t("A clear niche", "清晰的专长定位"), t("Proof of results", "可证明的成果"), t("Warm network & referrals", "人脉与转介绍")] },
    ],
  },
];

/** Where the paths, skills and timings come from (shown in the demo). */
export const CAREER_SOURCES: { label: string; url: string }[] = [
  { label: "Malaysian Medical Council — Guidebook for House Officers", url: "https://mmc.gov.my/wp-content/uploads/2025/09/A-Guidebook-for-House-Officers.pdf" },
  { label: "Malaysian Medical Council — Specialist Register FAQ", url: "https://mmc.gov.my/wp-content/uploads/2025/11/FREQUENTLY-ASKED-QUESTIONS-FAQ-ENTRY-INTO-THE-SPECIALIST-REGISTER-SR-OF-THE-MMC.pdf" },
  { label: "Pharmacy Board Malaysia — PRP training guide", url: "https://pharmacy.moh.gov.my/sites/default/files/document-upload/general-guide-versi-2023.pdf" },
  { label: "MVC Resources — Accountant career progression in Malaysia", url: "https://mvc-resources.com/accountant-salary-guide-and-career-progression-in-malaysia/" },
  { label: "Coastal Haven Partners — Private equity career path", url: "https://www.coastalhavenpartners.com/insights/private-equity-career-path" },
  { label: "Management consulting in Malaysia (Malaysia4U)", url: "https://malaysia4u.com/management-consulting-guide" },
  { label: "Evalon — Head of Data career guide", url: "https://www.evalon.tech/career-guides/head-of-data/" },
  { label: "The Pragmatic Engineer — Engineering career paths", url: "https://newsletter.pragmaticengineer.com/p/engineering-career-paths" },
  { label: "Skillshare — Becoming a creative director", url: "https://www.skillshare.com/blog/en/three-creative-directors-on-what-it-takes-to-land-a-dream-job/" },
  { label: "Rework — UX designer to senior and lead", url: "https://resources.rework.com/guides/ux-designer-playbooks/ux-designer-to-senior-and-lead-path" },
  { label: "Logistics Bureau — Supply chain career paths", url: "https://www.logisticsbureau.com/jobs-and-career-paths-in-supply-chain-and-logistics/" },
  { label: "Agency Builders — From freelancer to agency owner", url: "https://agencybuilders.com/resources/articles/freelancer-to-agency-owner/" },
  { label: "VoxEureka — MyCreator Pulse Report 2026", url: "https://voxeureka.com/mycreatorpulse/" },
  { label: "University of Cambridge Careers — Research in industry", url: "https://www.careers.cam.ac.uk/research-industry" },
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
export function handOffToFullTool(demo: { name: string; role: string; jobName: string; answers: Answer[]; lang: Lang }) {
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
  const next = { ...saved, v: 2, step: 1, lang: demo.lang, name: demo.name || (saved.name as string) || "", goal, jobs };
  try {
    localStorage.setItem(CAREER_PLAN_STORE, JSON.stringify(next));
  } catch {}
}
