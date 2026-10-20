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

/*
 * Editorial example routes, not required sequences or time-to-promotion forecasts.
 * Role-specific evidence and exercises live in career-evidence.ts. A source can
 * support responsibilities without validating this exact sequence of job titles.
 */
export const INDUSTRIES: Industry[] = [
  {
    id: "tech",
    name: t("Tech & AI", "科技与 AI"),
    roles: [
      { id: "ai-lead", name: t("AI Engineering Lead", "AI 工程负责人"), path: [t("Software Engineer", "软件工程师"), t("ML / AI Engineer", "机器学习 / AI 工程师"), t("Senior AI Engineer", "资深 AI 工程师")], skills: [t("LLM apps & retrieval (RAG)", "LLM 应用与检索 (RAG)"), t("MLOps & deployment", "MLOps 与部署"), t("System design", "系统设计")] },
      { id: "head-data", name: t("Head of Data", "数据负责人"), path: [t("Data Analyst / Engineer", "数据分析师 / 工程师"), t("Data Scientist / Senior Data Engineer", "数据科学家 / 资深数据工程师"), t("Analytics / Data Lead", "数据分析负责人")], skills: [t("Data strategy & governance", "数据策略与治理"), t("Machine learning & analytics", "机器学习与分析"), t("Leading data teams", "带领数据团队")] },
      { id: "product-director", name: t("Product Director", "产品总监"), path: [t("Business Analyst / Associate PM", "商业分析师 / 助理产品经理"), t("Product Owner / Product Manager", "产品负责人 / 产品经理"), t("Senior Product Manager", "资深产品经理")], skills: [t("Product strategy", "产品策略"), t("Cross-functional leadership", "跨部门领导"), t("Data-driven decisions", "数据驱动决策")] },
      { id: "regional-tech", name: t("Regional Tech Lead", "区域技术负责人"), path: [t("Senior Engineer", "资深工程师"), t("Tech Lead", "技术主管"), t("Engineering Manager", "技术经理")], skills: [t("Architecture", "架构设计"), t("Leading teams across countries", "带领跨国团队"), t("Stakeholder alignment", "跨部门协调")] },
    ],
  },
  {
    id: "business",
    name: t("Business & Finance", "商业与金融"),
    roles: [
      { id: "finance-director", name: t("Finance Director", "财务总监"), path: [t("Audit / Accounting Associate", "审计 / 会计专员"), t("Senior Accountant / FP&A", "资深会计 / 财务分析"), t("Finance Manager", "财务经理")], skills: [t("Reporting & financial controls", "财务报告与内控"), t("Financial planning & analysis", "财务规划与分析"), t("Business partnering", "业务伙伴思维")] },
      { id: "investment-director", name: t("Investment Director", "投资总监"), path: [t("Investment Analyst", "投资分析师"), t("Associate", "投资经理"), t("Vice President", "副总裁")], skills: [t("Financial modelling & valuation", "财务建模与估值"), t("Due diligence", "尽职调查"), t("Deal sourcing & negotiation", "项目开发与谈判")] },
      { id: "consulting-manager", name: t("Consulting Manager", "咨询经理"), path: [t("Business Analyst", "商业分析师"), t("Consultant / Associate", "顾问"), t("Senior Consultant", "资深顾问")], skills: [t("Structured problem-solving", "结构化解决问题"), t("Client presentation", "客户提案"), t("Industry expertise", "行业专长")] },
      { id: "supply-chain-manager", name: t("Supply Chain Manager", "供应链经理"), path: [t("Supply Chain Coordinator / Logistics Analyst", "供应链专员 / 物流分析师"), t("Planner / Buyer", "计划员 / 采购员"), t("Assistant Manager", "助理经理")], skills: [t("Demand & supply planning", "需求与供应计划"), t("Procurement & supplier management", "采购与供应商管理"), t("ERP & data analysis", "ERP 与数据分析")] },
    ],
  },
  {
    id: "creative",
    name: t("Marketing & Creative", "营销与创意"),
    roles: [
      { id: "marketing-director", name: t("Marketing Director", "市场总监"), path: [t("Marketing Executive", "市场专员"), t("Marketing Manager", "市场经理"), t("Associate Director", "副总监")], skills: [t("Digital & performance marketing", "数字与效果营销"), t("Brand strategy", "品牌策略"), t("Budget & commercial judgement", "预算与商业判断")] },
      { id: "creative-director", name: t("Creative Director", "创意总监"), path: [t("Designer / Junior Art Director", "设计师 / 初级艺术指导"), t("Art Director", "艺术指导"), t("Senior Art Director", "资深艺术指导")], skills: [t("Visual storytelling", "视觉叙事"), t("Creative direction & critique", "创意指导与评审"), t("Leading creative teams", "带领创意团队")] },
      { id: "creator", name: t("Full-time Content Creator", "全职内容创作者"), path: [t("Part-time creator", "兼职创作者"), t("Niche creator with a steady audience", "有稳定粉丝的垂直创作者"), t("Testing a revenue model", "测试收入模式")], skills: [t("Content production", "内容制作"), t("Audience growth", "粉丝增长"), t("Revenue models & platform rules", "收入模式与平台规则")] },
      { id: "ux-lead", name: t("UX Lead", "用户体验负责人"), path: [t("UX / UI Designer", "UX / UI 设计师"), t("Product Designer", "产品设计师"), t("Senior UX Designer", "资深 UX 设计师")], skills: [t("User research & storytelling", "用户研究与叙事"), t("Design systems", "设计系统"), t("Hiring & mentoring", "招聘与带人")] },
    ],
  },
  {
    id: "health",
    name: t("Healthcare & Science", "医疗与科研"),
    roles: [
      { id: "specialist", name: t("Medical Specialist", "专科医生"), path: [t("House Officer", "实习医生"), t("Medical Officer", "医疗官"), t("Recognised specialist training & supervised experience", "获认可的专科培训与受监督经验")], skills: [t("Clinical competence", "临床能力"), t("Specialist exams", "专科考试"), t("Patient communication", "医患沟通")] },
      { id: "pharmacy-manager", name: t("Pharmacy Manager", "药剂经理"), path: [t("Provisionally Registered Pharmacist", "实习药剂师 PRP"), t("Fully Registered Pharmacist", "注册药剂师"), t("Experienced Pharmacist", "有经验的药剂师")], skills: [t("Clinical pharmacy", "临床药学"), t("Applicable regulation & licensing", "适用法规与执照"), t("Team & inventory management", "团队与库存管理")] },
      { id: "research-scientist", name: t("Research Scientist", "研究科学家"), path: [t("Research Assistant", "研究助理"), t("PhD Researcher", "博士研究员"), t("Postdoc / Scientist", "博士后 / 科学家")], skills: [t("Research methods", "研究方法"), t("Publications & grants", "论文与经费申请"), t("Project management & collaboration", "项目管理与协作")] },
      { id: "hospital-gm", name: t("Hospital General Manager", "医院总经理"), path: [t("Admin / Operations Executive", "行政 / 运营专员"), t("Clinic / Unit Manager", "诊所 / 部门经理"), t("Operations Manager", "运营经理")], skills: [t("Healthcare operations", "医疗运营"), t("Compliance & accreditation", "合规与认证"), t("Leadership & decision-making", "领导与决策")] },
    ],
  },
  {
    id: "founder",
    name: t("Founder & Independent", "创业与自由职业"),
    roles: [
      { id: "startup-founder", name: t("Startup Founder", "自己创业"), path: [t("Problem discovery", "发现问题"), t("Small customer pilot", "小规模客户试点"), t("Repeatable delivery", "可重复交付")], skills: [t("Sales & fundraising", "销售与融资"), t("Product-market fit", "产品市场匹配"), t("Hiring", "招聘与组队")] },
      { id: "studio-owner", name: t("Studio / Agency Owner", "工作室老板"), path: [t("Freelancer", "自由职业者"), t("Freelancer with retainer clients", "有长期客户的自由职业者"), t("First hire / small team", "第一个员工 / 小团队")], skills: [t("Portfolio & personal brand", "作品集与个人品牌"), t("Contracts & documented processes", "合同与标准流程"), t("Client management", "客户管理")] },
      { id: "ecommerce-founder", name: t("E-commerce Brand Founder", "电商品牌创始人"), path: [t("Marketplace seller (Shopee / TikTok Shop)", "平台卖家（Shopee / TikTok Shop）"), t("Own-brand seller", "自有品牌卖家"), t("Multi-channel brand", "多渠道品牌")], skills: [t("Product sourcing", "选品与采购"), t("Performance ads", "投放广告"), t("Inventory & fulfilment across channels", "多渠道库存与履约")] },
      { id: "independent-consultant", name: t("Independent Consultant", "独立顾问"), path: [t("Industry specialist", "行业专员"), t("Senior expert", "资深专家"), t("First clients from your network", "从人脉中拿到第一批客户")], skills: [t("A clear niche", "清晰的专长定位"), t("Proof of results", "可证明的成果"), t("Warm network & referrals", "人脉与转介绍")] },
    ],
  },
];


const ALL_ROLES = INDUSTRIES.flatMap((industry) => industry.roles);

/** Match free text (either language) to a known role. */
export function findRole(input: string): Role | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;
  // A vague title such as "Director" must not silently become Finance Director.
  return ALL_ROLES.find((role) => role.name.en.toLowerCase() === q || role.name.cn.toLowerCase() === q) ?? null;
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
    insight: t("You flagged a skills gap. Ask which project, mentor or training budget could help you close it.", "你标记了技能差距。问问哪些项目、导师或培训预算能帮助你补足。"),
  },
  {
    q: t("Will I meet the people and resources I need?", "能接触到我需要的人脉 / 资源吗？"),
    hint: t("Colleagues, clients, industry circles, the company's platform", "同事、客户、行业圈子、公司平台"),
    insight: t("You flagged limited access to people. Ask who you would learn from and which teams or clients you would work with.", "你标记了人脉资源有限。问问能向谁学习，会与哪些团队或客户合作。"),
  },
  {
    q: t("Does it play to my strengths?", "能发挥我的优势吗？"),
    hint: t("Compare the daily tasks with work you enjoy and can sustain", "对照日常任务，是否是你喜欢且能长期投入的工作"),
    insight: t("You flagged a possible mismatch. Ask for a typical week's tasks before deciding how well the work fits.", "你标记了可能不匹配。先了解典型一周的任务，再判断工作是否适合。"),
  },
  {
    q: t("Will I build skills I can use beyond this role?", "能积累在其他岗位也有用的技能吗？"),
    hint: t("Look for transferable judgement, tools and domain knowledge—not a prediction about AI", "看可迁移的判断力、工具和行业知识，而不是预测 AI 会取代谁"),
    insight: t("You flagged limited transferability. Compare three adjacent job descriptions and look for skills they share.", "你标记了技能迁移性有限。比较三个相邻岗位的招聘要求，找出共通技能。"),
  },
  {
    q: t("Will this work give me evidence for my next move?", "这份工作能为下一步积累成果证据吗？"),
    hint: t("Look for scope, outcomes and progression examples—not the title alone", "看职责范围、成果和真实晋升案例，不只看头衔"),
    insight: t("You flagged a progression gap. Ask for a recent example of someone moving on, and the work that made it possible.", "你标记了发展路径不清晰。问问近期有人如何迈向下一步，以及靠什么成果做到。"),
  },
];

export type Verdict = { tone: "go" | "mid" | "no" | "none"; label: Text; detail: Text };

export function verdictFor(answers: Answer[]): Verdict {
  if (answers.length !== 5 || answers.some((a) => typeof a !== "boolean")) return { tone: "none", label: t("Still exploring", "继续了解"), detail: t("Answer all 5 checks; leave unknowns unanswered until you have evidence.", "完成 5 项检查；不确定的项目先留空，找到证据再回答。") };
  const score = answers.filter((a) => a === true).length;
  if (score >= 4) return { tone: "go", label: t("Promising fit", "值得深入了解"), detail: t("Your answers suggest alignment. Verify the role, pay, workload and personal constraints before deciding.", "你的回答显示较匹配。决定前仍需核实职责、薪资、工作量和个人情况。") };
  if (score >= 2) return { tone: "mid", label: t("Trade-offs to explore", "需要权衡"), detail: t("Some checks align. Discuss the gaps and agree on a review point—not an automatic exit date.", "部分条件匹配。讨论差距并约定复盘时间，而不是自动设定离职日期。") };
  return { tone: "no", label: t("More evidence needed", "需要更多证据"), detail: t("Few checks align with this goal. Explore alternatives and your constraints; this is not a rejection recommendation.", "与这个目标匹配的项目较少。结合现实条件探索其他选择；这不是拒绝工作的建议。") };
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
