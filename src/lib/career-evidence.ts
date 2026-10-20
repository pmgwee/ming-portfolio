import type { Text } from "./career-plan";

const t = (en: string, cn: string): Text => ({ en, cn });
export const EVIDENCE_REVIEWED = "2026-10-19";

export type CareerSource = {
  title: string;
  url: string;
  kind: "framework" | "job" | "practitioner" | "regulator" | "guide";
  scope: Text;
  finding: Text;
};
export type CareerEvidence = {
  /** Editorial synthesis, not a quotation or a promise of progression. */
  shift: Text;
  experiment: Text;
  ask: Text;
  caveat: Text;
  sources: CareerSource[];
};

const engineering: CareerSource = {
  title: "GitLab · Engineering Manager",
  url: "https://handbook.gitlab.com/job-description-library/engineering/development/management/engineering-manager/",
  kind: "framework", scope: t("Global · one employer", "全球 · 单一雇主"),
  finding: t("The role combines coaching, hiring, delivery and cross-team coordination. It is not simply a more senior coding role.", "职责包括辅导、招聘、交付和跨团队协调，并不只是更资深的编程岗位。"),
};
const bjak: CareerSource = {
  title: "BJAK · Applied AI Engineer",
  url: "https://www.linkedin.com/jobs/view/4480929663",
  kind: "job", scope: t("Malaysia · listing snapshot", "马来西亚 · 招聘快照"),
  finding: t("This posting asks for shipped AI systems, evaluations and reliability under cost, latency and security constraints. It is an engineer role, not a lead-role benchmark.", "该职位要求可上线的 AI 系统、评估与可靠性，并考虑成本、延迟和安全。这是工程师招聘，不是负责人晋升标准。"),
};
const deloitte: CareerSource = {
  title: "Deloitte · AI & Data Consultant",
  url: "https://www.linkedin.com/jobs/view/4299334646",
  kind: "job", scope: t("Kuala Lumpur · listing snapshot", "吉隆坡 · 招聘快照"),
  finding: t("The posting spans strategy, implementation, testing, deployment and adoption, with communication and regional collaboration alongside technical skills.", "招聘职责覆盖策略、实施、测试、部署和应用落地，同时强调沟通和区域协作。"),
};
const pendulum: CareerSource = {
  title: "Charity Majors · The Engineer/Manager Pendulum",
  url: "https://www.infoq.com/presentations/hands-on-coding-managers/",
  kind: "practitioner", scope: t("First-person talk · 2023 · one career", "2023 年本人演讲 · 个体经历"),
  finding: t("Honeycomb's co-founder describes moving between engineering and management. Her experience challenges the idea that management is the only way to progress.", "Honeycomb 联合创始人分享工程与管理之间的转换，说明管理并非唯一的发展方向。"),
};

export const CAREER_EVIDENCE: Record<string, CareerEvidence> = {
  "ai-lead": {
    shift: t("From building a clever model to making an AI system useful, reliable and owned by a team.", "从做出聪明的模型，到让团队交付真正有用、可靠的 AI 系统。"),
    experiment: t("Choose one small workflow. Build a prototype and a 10-case evaluation sheet; record failures, cost and response time. Ask an engineer to review the trade-offs.", "选一个小流程，做原型和 10 个测试案例，记录失败情况、成本与响应时间。请工程师评审你的取舍。"),
    ask: t("Who owns evaluation and incidents after launch—and would I help make those decisions?", "上线后谁负责评估和故障？我能参与这些决策吗？"),
    caveat: t("Example route for applied AI, not research science. A lead may manage people or remain a technical specialist; confirm the actual scope.", "这是应用 AI 的示例路线，不是科研路线。负责人可能带人，也可能走技术专家方向，需核实具体职责。"),
    sources: [bjak, deloitte, engineering, {
      title: "Ng Hui Siang · Public LinkedIn experience",
      url: "https://www.linkedin.com/in/nghuisiang/",
      kind: "practitioner", scope: t("Malaysia · self-reported career example", "马来西亚 · 本人公开经历"),
      finding: t("His profile describes AI validation, full-stack product delivery and later ownership of AI solutions. This is one self-reported journey, not an independently verified promotion timeline or endorsement.", "其公开经历包括 AI 验证、全栈产品交付，以及之后负责 AI 解决方案。这是个体自述，不是独立核实的晋升时间表或背书。"),
    }],
  },
  "head-data": {
    shift: t("From answering data questions to deciding which data the organisation can trust.", "从回答数据问题，到决定组织可以信任哪些数据。"),
    experiment: t("Pick one business metric. Document its definition, owner, data-quality checks and a decision it should change. Review the one-page brief with a stakeholder.", "选一个业务指标，写清定义、负责人、质量检查及它应影响的决策，找业务伙伴评审这一页说明。"),
    ask: t("Who resolves conflicting metric definitions, and what authority does the data team have?", "指标定义冲突时谁来决定？数据团队有多大决策权？"),
    caveat: t("Titles and seniority vary. This employer framework supports responsibilities, not an 8–12-year promotion forecast.", "头衔与级别因公司而异。雇主框架支持的是职责，不是 8–12 年晋升预测。"),
    sources: [{ title: "GitLab · Data and Insights Executive", url: "https://handbook.gitlab.com/job-description-library/marketing/enterprise-data/data-and-insights-executive/", kind: "framework", scope: t("Global · one employer", "全球 · 单一雇主"), finding: t("Data leadership owns the data roadmap, common models, governance and collaboration with company functions.", "数据管理层负责数据路线图、统一模型、治理及跨部门合作。") }],
  },
  "product-director": {
    shift: t("From delivering features to choosing which problems deserve the team's time.", "从交付功能，到选择哪些问题值得团队投入。"),
    experiment: t("Compare two product opportunities on one page: user problem, evidence, expected outcome and what you would stop doing. Ask a PM to challenge your choice.", "用一页比较两个产品机会：用户问题、证据、预期结果及要停止的工作。请产品经理挑战你的选择。"),
    ask: t("Which outcomes would I own, and can you show a decision changed by user evidence?", "我会负责哪些结果？能举例说明用户证据如何改变产品决策吗？"),
    caveat: t("The source describes PM competencies, including senior individual contributors. A director usually also needs organisational leadership; it is not an automatic next title.", "来源描述产品经理及资深个人贡献者能力。总监通常还需组织领导力，并非自动晋升的下一站。"),
    sources: [{ title: "GitLab · Product Management Competencies", url: "https://handbook.gitlab.com/handbook/product/product-management/product-cdf-competencies/", kind: "framework", scope: t("Global · one employer", "全球 · 单一雇主"), finding: t("The framework connects product direction with evidence, iteration, metrics and alignment across teams.", "框架将产品方向与证据、迭代、指标及团队协调相连接。") }],
  },
  "regional-tech": {
    shift: t("From solving a team's technical problems to helping several teams make sound decisions.", "从解决一个团队的技术问题，到帮助多个团队做出合理决策。"),
    experiment: t("Write a short architecture decision: two options, operational risks and an owner. Ask someone outside your team to explain it back to you.", "写一份简短架构决策：两个选项、运营风险及负责人。请团队外的人复述，检验是否清晰。"),
    ask: t("Does this role own architecture, people management, delivery—or all three across regions?", "这个岗位负责跨区域架构、人员管理、交付，还是三者兼具？"),
    caveat: t("Regional Tech Lead is not a standardised title. Technical and management tracks can diverge; one practitioner's journey is not a typical timeline.", "区域技术负责人不是统一标准的头衔。技术与管理路线可能分开；个人经历不代表典型时间表。"),
    sources: [engineering, pendulum],
  },
  "finance-director": {
    shift: t("From reporting the numbers to explaining the decisions they should change.", "从报告数字，到解释数字应该改变哪些决策。"),
    experiment: t("Use a fictional business to build a one-page cash-flow scenario. Explain the assumptions, downside risk and a decision for management.", "用虚构业务做一页现金流情景分析，解释假设、下行风险及管理层需要做的决策。"),
    ask: t("Would I influence planning and commercial decisions, or mainly prepare reports?", "我能参与规划和商业决策，还是主要编制报表？"),
    caveat: t("Audit is one entry route, not a requirement. Qualifications and registration depend on the work and jurisdiction; no promotion timetable is implied.", "审计只是入行路线之一，不是必经步骤。资格与注册要求取决于工作及地区，不代表晋升时间表。"),
    sources: [{ title: "ACCA · Finance Director", url: "https://careernavigator.accaglobal.com/gb/en/job-profiles/leader/finance-director.selector.Expert.html", kind: "guide", scope: t("Professional body · global/UK context", "专业机构 · 全球 / 英国语境"), finding: t("The profile connects financial strategy, controls, liquidity, risk and team leadership with business goals.", "角色说明将财务策略、内控、流动性、风险及团队领导与业务目标连接。") }],
  },
  "investment-director": {
    shift: t("From making a valuation model to defending an investment decision and its risks.", "从做估值模型，到说明投资决策及其风险。"),
    experiment: t("Write a mock investment memo using public information: thesis, valuation assumptions, three risks and what evidence would change your mind. Do not treat it as investment advice.", "用公开资料写模拟投资备忘录：论点、估值假设、三个风险及哪些证据会改变判断。这不是投资建议。"),
    ask: t("What part of diligence and investment-committee decisions would I actually own?", "尽职调查和投委会决策中，我会实际负责哪些部分？"),
    caveat: t("This example concerns private markets. Investment director titles and routes differ across PE, venture capital, public markets and corporate investment.", "示例以私募市场为背景。私募股权、风投、公开市场及企业投资的总监职责与路线各不相同。"),
    sources: [{ title: "CFA Institute · Private Markets Due Diligence", url: "https://www.cfainstitute.org/programs/cfa-program/candidate-resources/practical-skills-modules/due-diligence", kind: "guide", scope: t("Professional curriculum · private markets", "专业课程 · 私募市场"), finding: t("The curriculum covers financial, operational and legal diligence, valuation and deal structuring. It supports skills, not director-level eligibility.", "课程涵盖财务、运营与法律尽调、估值及交易结构，支持技能参考，不代表总监任职资格。") }],
  },
  "consulting-manager": {
    shift: t("From solving a workstream to helping a team deliver a client outcome.", "从解决一个工作模块，到带团队实现客户目标。"),
    experiment: t("Take one operational problem. Make an issue tree, list the evidence needed and propose a measurable outcome. Ask a practitioner to challenge your assumptions.", "选一个运营问题，画问题树、列出需要的证据并提出可衡量结果，请从业者挑战你的假设。"),
    ask: t("How much of this role is analysis, client communication and coaching others?", "这个岗位的分析、客户沟通和辅导他人分别占多少？"),
    caveat: t("Firm titles vary. McKinsey uses Associate and Engagement Manager; a Senior Consultant step is not universal.", "不同公司头衔不同。麦肯锡使用 Associate 和 Engagement Manager，Senior Consultant 不是通用的必经步骤。"),
    sources: [{ title: "McKinsey · Consulting Roles", url: "https://www.mckinsey.com/careers/our-roles/consulting-roles", kind: "framework", scope: t("Global · one employer", "全球 · 单一雇主"), finding: t("Associates own workstreams; engagement managers lead projects, manage execution and mentor colleagues.", "Associate 负责工作模块；Engagement Manager 领导项目、管理执行并辅导同事。") }],
  },
  "supply-chain-manager": {
    shift: t("From tracking stock to balancing availability, cost and operational risk.", "从追踪库存，到平衡供应、成本与运营风险。"),
    experiment: t("Map a simple product's route from supplier to customer. Model one delayed shipment and explain the inventory, cost and service trade-offs.", "画出一个产品从供应商到客户的流程，模拟一次延误，解释库存、成本及服务之间的取舍。"),
    ask: t("Which planning decisions would I own, and how are service levels balanced against inventory cost?", "我会负责哪些计划决策？如何平衡服务水平与库存成本？"),
    caveat: t("Planning, procurement and logistics are different entry points. An assistant-manager title is not a prerequisite.", "计划、采购和物流都是不同入口，不必先取得助理经理头衔。"),
    sources: [{ title: "ASCM · Supply Chain Career Paths", url: "https://www.ascm.org/ascm-insights/supply-chain-management-career-path/", kind: "guide", scope: t("Professional body · international context", "专业机构 · 国际背景"), finding: t("The guide describes routes through inventory and planning, alongside procurement, operations, risk and leadership skills.", "指南介绍库存与计划路线，以及采购、运营、风险和领导技能。") }],
  },
  "marketing-director": {
    shift: t("From launching campaigns to deciding where marketing creates business value.", "从推出营销活动，到决定营销如何创造业务价值。"),
    experiment: t("Draft a small campaign brief: audience, insight, channel, budget and one outcome to measure. Explain what evidence would justify stopping it.", "写一份小型营销方案：受众、洞察、渠道、预算及一个衡量结果，并说明什么证据会让你停止活动。"),
    ask: t("Which commercial outcomes and budget decisions belong to this role?", "这个岗位负责哪些商业结果和预算决策？"),
    caveat: t("The framework covers marketing capabilities, not a universal director specification or time-to-promotion estimate.", "框架涵盖营销能力，不是通用的总监任职标准或晋升时间预测。"),
    sources: [{ title: "CIM · Global Professional Marketing Framework", url: "https://www.cim.co.uk/membership/cim-standards/global-professional-marketing-framework-gpmf/", kind: "framework", scope: t("Professional body · global framework", "专业机构 · 全球框架"), finding: t("The framework combines strategy, brand, data, commercial awareness, governance and people/resource management.", "框架结合策略、品牌、数据、商业意识、治理及人员与资源管理。") }],
  },
  "creative-director": {
    shift: t("From making strong work to giving a team a clear creative direction.", "从做出优秀作品，到为团队提供清晰的创意方向。"),
    experiment: t("Take one fictional brief. Show two visual directions and explain the audience, idea, production constraints and why you chose one. Invite critique.", "选一份虚构简报，展示两个视觉方向，解释受众、想法、制作限制与选择理由，并邀请评审。"),
    ask: t("Would I set the concept and review a team's work, or mainly execute existing ideas?", "我会制定概念并评审团队作品，还是主要执行现有想法？"),
    caveat: t("Art director is an adjacent role, not identical to creative director. Agency, film and in-house titles differ.", "艺术指导是相关但不完全相同的角色。广告公司、影视与企业内部头衔不同。"),
    sources: [{ title: "US BLS · Art Directors", url: "https://www.bls.gov/ooh/arts-and-design/art-directors.htm", kind: "guide", scope: t("US · adjacent occupation", "美国 · 相关职业"), finding: t("Art directors set visual direction, review creative work and coordinate teams, budgets and schedules. Entry backgrounds vary.", "艺术指导制定视觉方向、评审作品并协调团队、预算和进度，入行背景多样。") }],
  },
  "creator": {
    shift: t("From chasing a successful post to building a repeatable audience relationship.", "从追求一篇爆款，到建立可持续的受众关系。"),
    experiment: t("Make three pieces for one specific audience problem. Record production time and what viewers actually ask next. Test a format before assuming it can fund full-time work.", "围绕一个具体受众问题制作三份内容，记录制作时间和观众后续提问。先测试形式，不先假定能支撑全职收入。"),
    ask: t("Which revenue stream could work for my audience, and what eligibility, costs and volatility come with it?", "哪些收入方式适合我的受众？有哪些资格门槛、成本和波动？"),
    caveat: t("Brand deals are optional. Monetisation eligibility does not imply stable income; platform and market rules vary.", "品牌合作并非必经阶段。符合变现资格不等于收入稳定，平台和市场规则也不同。"),
    sources: [{ title: "YouTube Help · Ways to Earn", url: "https://support.google.com/youtube/answer/11912533?hl=en", kind: "guide", scope: t("Platform policy · YouTube only", "平台规则 · 仅限 YouTube"), finding: t("YouTube lists several revenue options with eligibility and policy conditions, rather than one required monetisation route.", "YouTube 列出多种收入方式及对应资格与政策条件，不是一条必经的变现路线。") }],
  },
  "ux-lead": {
    shift: t("From improving one experience to helping teams make decisions with user evidence.", "从改善一个体验，到帮助团队依据用户证据做决策。"),
    experiment: t("Review one user journey. Separate observed problems from assumptions, propose a research question and explain how the findings could change a design decision.", "检视一个用户旅程，区分已观察的问题和假设，提出研究问题并解释结果如何改变设计决策。"),
    ask: t("How does research influence roadmap decisions, and who coaches designers or researchers?", "研究如何影响产品路线图？谁负责辅导设计师或研究员？"),
    caveat: t("This evidence covers user-research leadership, one UX specialism. Design leadership and design-system roles need additional role-specific checks.", "依据涵盖 UX 中的用户研究领导方向。设计管理和设计系统岗位还需进一步核实。"),
    sources: [{ title: "UK Government · User Researcher Framework", url: "https://understand-digital-data-roles-skills.service.gov.uk/role/user-researcher/", kind: "framework", scope: t("UK public sector · adjacent specialism", "英国公共部门 · 相关专业方向"), finding: t("Senior and lead researchers develop colleagues, coordinate research across teams and support evidence-based practice.", "资深及负责人研究员培养同事、协调跨团队研究并支持循证实践。") }],
  },
  "specialist": {
    shift: t("From an aspirational title to a recognised training and registration pathway.", "从目标头衔，到受认可的培训与注册路径。"),
    experiment: t("Choose a specialty. Use MMC guidance to list the qualifications, supervision and registration questions you must confirm with an authorised training contact.", "选一个专科，依据 MMC 指南列出需要向授权培训负责人确认的资格、监督和注册问题。"),
    ask: t("Is this exact qualification and training route recognised for my circumstances, and what supervised experience remains?", "这个具体资格与培训路线是否适用于我的情况？还需要哪些受监督经验？"),
    caveat: t("Malaysia: completing training alone does not confer specialist registration. Check current MMC requirements for your route; this is not an eligibility determination.", "马来西亚：完成培训并不自动取得专科注册。请向 MMC 核实适用于你的最新要求；此工具不判断个人资格。"),
    sources: [{ title: "MMC · Specialist Registration Procedures (2025)", url: "https://mmc.gov.my/wp-content/uploads/2025/10/THE-PROCEDURES-AND-GUIDELINES-FOR-SPECIALIST-REGISTRATION-version-After-MPM-459-Meeting.pdf", kind: "regulator", scope: t("Malaysia · regulator · 2025 procedures", "马来西亚 · 监管机构 · 2025 年程序"), finding: t("The procedures cover full registration, relevant qualifications/training, supervised or accepted work experience and competence criteria across different routes.", "程序涉及完全注册、相关资格与培训、受监督或获认可的工作经验，以及不同路线的能力要求。") }],
  },
  "pharmacy-manager": {
    shift: t("From professional registration to leading safe services and an effective team.", "从专业注册，到带领安全服务与高效团队。"),
    experiment: t("Separate your registration requirements from your management goals. Confirm the applicable PRP and assessment route with PBM or an authorised training supervisor.", "把注册要求与管理目标分开，向 PBM 或授权培训主管确认适用的 PRP 和考核路线。"),
    ask: t("Which registration, licensing and supervision requirements apply to this specific workplace?", "这个具体工作场所适用哪些注册、执照和监督要求？"),
    caveat: t("The PBM hospital guide requires at least a year of satisfactory PRP experience and assessment. It does not establish automatic registration or a route to manager.", "PBM 医院指南要求至少一年的合格 PRP 经验及考核，并不代表自动注册或晋升经理。"),
    sources: [{ title: "Pharmacy Board Malaysia · PRP Guide (2023)", url: "https://pharmacy.moh.gov.my/sites/default/files/document-upload/general-guide-versi-2023.pdf", kind: "regulator", scope: t("Malaysia · MOH/MOHE/MOD hospital training guide", "马来西亚 · MOH/MOHE/MOD 医院培训指南"), finding: t("Training must be at eligible premises and satisfy the Board's assessment; extensions may be needed. Confirm current requirements for your setting.", "培训须在合资格场所进行并满足委员会考核要求，可能需要延长。请核实适用于你的场所的现行要求。") }],
  },
  "research-scientist": {
    shift: t("From collecting qualifications to showing you can answer a worthwhile research question.", "从积累学历，到证明能回答有价值的研究问题。"),
    experiment: t("Compare three vacancies in your chosen scientific field. Mark the techniques, credentials and research outputs each actually requests before choosing more study.", "比较所选科学领域的三个职位，标记实际要求的技术、资格与研究成果，再决定是否继续深造。"),
    ask: t("Does this role require a PhD, or evidence of specific methods and industry experience?", "岗位必须有博士学位，还是更看重具体方法和行业经验？"),
    caveat: t("The displayed route is an academic example. Industry entry varies: a Master's, PhD or postdoc is not universally required.", "所示为学术路线示例。产业入口各异，硕士、博士或博士后并非普遍必需。"),
    sources: [{ title: "Cambridge Careers · Science Research", url: "https://www.careers.cam.ac.uk/sectors-science-research", kind: "guide", scope: t("University guidance · UK/international context", "大学职业指导 · 英国 / 国际背景"), finding: t("Industry research entry requirements differ by organisation and sector; techniques, research outcomes and collaboration help demonstrate fit.", "产业研究的入职要求因机构与领域而异，技术、研究成果与协作可帮助证明匹配度。") }],
  },
  "hospital-gm": {
    shift: t("From running one unit to balancing quality, staffing, budgets and compliance.", "从管理一个部门，到平衡质量、人员、预算与合规。"),
    experiment: t("Map a non-clinical service process using fictional data. Identify a bottleneck, a quality measure and an operational trade-off to discuss with a healthcare manager.", "使用虚构数据画出非临床服务流程，找出瓶颈、质量指标与运营取舍，并与医疗管理者讨论。"),
    ask: t("Which facility-level outcomes would I own, and where does clinical governance sit?", "我会负责哪些机构层面的结果？临床治理由谁负责？"),
    caveat: t("The source covers a broader US occupation. Malaysian hospital-GM responsibilities and accreditation requirements need local employer checks.", "来源为美国较广泛的职业分类。马来西亚医院总经理职责及认证要求需向本地雇主核实。"),
    sources: [{ title: "US BLS · Medical and Health Services Managers", url: "https://www.bls.gov/ooh/management/medical-and-health-services-managers.htm", kind: "guide", scope: t("US · broader occupation", "美国 · 较广泛职业分类"), finding: t("Healthcare managers oversee quality, efficiency, budgets, staffing, records and compliance, with scope varying by facility or department.", "医疗管理者负责质量、效率、预算、人员、记录和合规，范围因机构或部门而异。") }],
  },
  "startup-founder": {
    shift: t("From an idea you like to a problem someone will commit to solving.", "从自己喜欢的想法，到别人愿意投入解决的问题。"),
    experiment: t("Talk to three potential users about their current workaround. Offer a small manual pilot and record what they commit—not just whether they praise the idea.", "找三个潜在用户了解现有解决方法，提出小规模人工试点，记录他们愿意投入什么，而不只是是否称赞想法。"),
    ask: t("Who has this problem now, how do they handle it, and what would make a small pilot worthwhile?", "谁现在有这个问题、如何解决，以及什么会让一个小试点值得尝试？"),
    caveat: t("These are experiments, not a job ladder. A co-founder, VC funding or prior startup job is not a universal prerequisite.", "这些是实验，不是晋升阶梯。联合创始人、风投资金或初创工作经历都不是普遍前提。"),
    sources: [{ title: "Y Combinator · Founder Sales Lecture", url: "https://www.ycombinator.com/library/dc-how-to-start-a-startup-sales-and-marketing-how-to-talk-to-investors", kind: "practitioner", scope: t("US startup · first-person teaching", "美国初创 · 创始人亲述教学"), finding: t("Clever co-founder Tyler Bosmeny describes learning sales at an earlier startup and applying it at Clever. One founder's account, not a success-rate study.", "Clever 联合创始人 Tyler Bosmeny 分享在前一家初创学习销售并应用于 Clever。这是个人经历，不是成功率研究。") }],
  },
  "studio-owner": {
    shift: t("From delivering your own craft to designing a service clients can rely on.", "从交付个人手艺，到建立客户可依赖的服务。"),
    experiment: t("Package one service: audience, deliverables, exclusions, review rounds and delivery cost. Ask a past or potential client where the offer is unclear.", "整理一个服务：受众、交付物、不包含内容、修改轮次和交付成本，请过往或潜在客户指出不清晰之处。"),
    ask: t("Can I deliver this profitably and consistently without promising unlimited revisions?", "不承诺无限修改的情况下，我能稳定且盈利地交付吗？"),
    caveat: t("A solo studio is a valid option; retainers and hiring are choices. The older US source is practice context, not a Malaysian legal template.", "个人工作室也是可行选择；长期合约与招聘是选项。较早的美国资料仅供实践参考，不是马来西亚法律模板。"),
    sources: [{ title: "AIGA · Design Business and Ethics (2009)", url: "https://www.aiga.org/sites/default/files/2021-03/Design-Business-and-Ethics.pdf", kind: "guide", scope: t("US professional association · historical guidance", "美国专业协会 · 历史指导资料"), finding: t("The guide covers defining client objectives, budgeting, managing design work and agreements for services.", "指南涵盖定义客户目标、预算、设计工作管理及服务协议。") }],
  },
  "ecommerce-founder": {
    shift: t("From making a sale to delivering an order with workable economics.", "从完成一单销售，到以可行的成本完成履约。"),
    experiment: t("Model one sample order: sourcing, packaging, fees, shipping and returns. Compare self-fulfilment with a provider before committing inventory.", "模拟一笔订单的采购、包装、平台费用、物流和退货成本；投入库存前比较自行履约与服务商方案。"),
    ask: t("What remains after all fulfilment and acquisition costs, and what happens when an order is returned?", "扣除全部履约与获客成本后还剩多少？退货时会怎样？"),
    caveat: t("Marketplace, own-store and multi-channel routes are options. This commercially interested source does not establish profitability or demand.", "平台、自建店与多渠道都是选项。该来源有商业利益，不证明盈利或市场需求。"),
    sources: [{ title: "Shopify · Fulfilment Guide", url: "https://www.shopify.com/blog/what-is-fulfillment", kind: "guide", scope: t("Platform operator · international context", "平台运营商 · 国际背景"), finding: t("Fulfilment includes inventory, processing and delivery, handled in-house or outsourced. Briogeo's founder describes moving shipping from her apartment to a warehouse.", "履约涵盖库存、处理与配送，可自营或外包。Briogeo 创始人分享从公寓发货转向仓库的经历。") }],
  },
  "independent-consultant": {
    shift: t("From knowing a field well to defining a client problem you can responsibly help solve.", "从熟悉一个领域，到定义自己能负责解决的客户问题。"),
    experiment: t("Draft a fixed-scope diagnostic: client problem, information needed, deliverable, limits and fee assumptions. Ask a potential client which outcome would be useful.", "起草固定范围的诊断服务：客户问题、所需资料、交付物、边界和收费假设，询问潜在客户哪些结果有用。"),
    ask: t("Can I describe the outcome, boundaries and evidence of value without overpromising?", "我能否清晰说明结果、边界及价值证据，而不夸大承诺？"),
    caveat: t("Seniority and referrals can help but do not guarantee clients. Professional certification is not presented here as a legal requirement.", "资历与转介绍可能有帮助，但不保证客户。这里不将专业认证视作法律要求。"),
    sources: [{ title: "IMC USA · Management Consulting Curriculum", url: "https://www.imcusa.org/education/mastering-management-consulting-mmc/", kind: "guide", scope: t("US professional body · practice skills", "美国专业机构 · 实践技能"), finding: t("The curriculum covers client needs, scope, proposals, implementation, ethics, marketing and relationship management.", "课程涵盖客户需求、范围、提案、实施、伦理、营销和关系管理。") }],
  },
};
