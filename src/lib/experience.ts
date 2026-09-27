export interface ExperienceEntry {
  role: string;
  organization: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: "Automation Engineer Intern",
    organization: "iFAST Capital Sdn Bhd",
    dates: "March 2024 – August 2024",
    location: "Kuala Lumpur, Malaysia",
    bullets: [
      "Architected and implemented a Spring Batch compliance pipeline, designing the job flow and processing patterns to process client account records against complex passport-expiry constraints. Automated transaction restrictions, audit trails and six rule-triggered email notification types, while optimizing the processing workflow through bulk operations and avoiding hard-coded logic.",
      "Translated an investor-classification requirement into an end-to-end system enhancement, mapping how new investor attributes should be captured, derived, persisted and reloaded across account-opening, account-update and profile-maintenance journeys.",
      "Collaborated with 14 developers and 4 project directors across monthly sprints, supporting CI/CD pipelines, change request management and production releases for both internal and external business-critical fintech systems.",
    ],
  },
  {
    role: "Ski & Snowboard Technician · USA Work & Travel",
    organization: "Ober Mountain",
    dates: "December 2025 – May 2026",
    location: "Gatlinburg, Tennessee",
    bullets: [
      "Worked in a diverse, multicultural team representing over 10 countries, adapting to a new work environment by overcoming language barriers.",
      "Recognized with 2 Honorable Mentions from a manager for resolving complex customer issues with technical expertise.",
    ],
  },
  {
    role: "Founder",
    organization: "Yierming Production (Studio)",
    dates: "May 2024 – December 2025",
    location: "Kuala Lumpur, Malaysia",
    bullets: [
      "Designed and launched branding and web content for an AI education startup led by a former technology company AI Director.",
      "Directed a four-digit budget commercial campaign for a Web3 brand with 14K+ followers.",
      "Delivered digital marketing strategies for a 400K-follower F&B brand, driving 10K+ Shopee sales for top products.",
    ],
  },
];

export const EDUCATION = [
  {
    qualification: "Master of Business Administration · Online Learning",
    institution: "INTI International University",
    dates: "June 2026 – Present",
  },
  {
    qualification: "Bachelor of Computer Science (Honours)",
    institution: "Universiti Sains Malaysia",
    dates: "October 2021 – October 2025",
  },
] as const;
