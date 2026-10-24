export interface ExperienceEntry {
  role: string;
  organization: string;
  /** Short field label for the Engineering section's chips. */
  field: string;
  dates: string;
  location?: string;
  bullets: string[];
}

// Employers, schools and exact figures are described, never named: they are
// searchable and would link this brand back to the creator's real-name
// profiles (see CLAUDE.md, identity separation).
export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: "Automation Engineer Intern",
    organization: "Fintech investment platform",
    field: "Fintech industry",
    dates: "2024 · 6 months",
    location: "Malaysia",
    bullets: [
      "Built a Spring Batch compliance pipeline that checks client account records against document-expiry rules, applying transaction restrictions, audit trails and rule-triggered email notifications, with bulk processing in place of hard-coded logic.",
      "Turned a new investor-classification requirement into an end-to-end enhancement, mapping how new attributes are captured, derived, stored and reloaded across account opening, account updates and profile maintenance.",
      "Worked in monthly sprints with a cross-functional engineering team, supporting CI/CD pipelines, change requests and production releases for business-critical fintech systems.",
    ],
  },
  {
    role: "Ski & Snowboard Technician",
    organization: "Ski resort · work and travel programme",
    field: "Customer service",
    dates: "Winter 2025–26",
    location: "United States",
    bullets: [
      "Worked in a multicultural team from more than ten countries, adapting quickly to a new work environment and language barriers.",
      "Recognized by management for resolving complex customer issues with technical expertise.",
    ],
  },
  {
    role: "Founder",
    organization: "Independent creative production studio",
    field: "Filmmaking production",
    dates: "2024 – 2025",
    location: "Malaysia",
    bullets: [
      "Designed and launched branding and web content for an AI education startup.",
      "Directed a commercial campaign for a Web3 brand.",
      "Delivered digital marketing strategies for a large F&B brand, driving 10K+ marketplace sales for its top products.",
    ],
  },
];

export const EDUCATION = [
  {
    qualification: "Master of Business Administration · Online Learning",
    institution: "Private university, Malaysia",
    dates: "2026 – Present",
  },
  {
    qualification: "Bachelor of Computer Science (Honours)",
    institution: "Public research university, Malaysia",
    dates: "2021 – 2025",
  },
] as const;
