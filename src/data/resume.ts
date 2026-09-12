/**
 * THE source of truth for résumé content.
 *
 * Three consumers read this file:
 *   1. `src/lib/resume-adapter.ts` → `src/constants/*.ts` → the landing page
 *   2. `src/components/resume/ResumePaper.tsx` → `/` (tab) and `/resume`
 *   3. `scripts/resume.ts` → `build/resume.tex` → `public/resume.pdf`
 *
 * Keep this file free of imports. Node runs it directly (type-stripping, no
 * bundler) when generating the LaTeX, and bare Node does not resolve the
 * `@/*` tsconfig path alias — an import here means a new build dependency.
 *
 * Write prose in real Unicode (– — ~ …). `scripts/lib/to-latex.ts` converts to
 * LaTeX escapes; the web renders it as-is.
 */

export interface ResumeEntry {
	organization: string;
	/** Job title. Rendered `(italic)` on the paper, `\role{…}` in LaTeX. */
	role?: string;
	url?: string;
	startDate?: Date;
	/** Absent while `startDate` is set ⇒ ongoing, rendered as "Now". */
	endDate?: Date;
	/** The authoritative facts. Rendered as a list on the web and in LaTeX. */
	bullets: string[];
	/** Default true. `false` keeps an entry on the site but out of the PDF. */
	inResume?: boolean;
}

export interface ResumeSection {
	heading: string;
	entries: ResumeEntry[];
}

export interface EducationEntry {
	institution: string;
	location: string;
	degree: string;
	/** e.g. "First Class Honours". Rendered between the degree and the GPA. */
	honors?: string;
	gpa?: string;
	startDate: Date;
	endDate: Date;
}

export interface SkillGroup {
	label: string;
	items: string[];
}

export interface ResumeProfile {
	name: string;
	tagline: string;
	location: string;
	email: string;
	website: string;
	github: string;
	linkedin: string;
	languages: { language: string; level: string }[];
}

export interface ResumeData {
	profile: ResumeProfile;
	sections: ResumeSection[];
	education: EducationEntry[];
	skills: SkillGroup[];
	/** Small caption under the Technical Skills heading. Explains the ordering. */
	skillsNote?: string;
}

export const Resume: ResumeData = {
	profile: {
		name: "Supratouch Suwatno",
		tagline: "Graduated Information Technology Student (Software Engineering)",
		location: "Bangkok, Thailand",
		email: "su.suwatno@gmail.com",
		// Phone deliberately omitted: this résumé is published on a public URL
		// and committed to a public repo. Add it to a private variant if a
		// specific application asks for one.
		website: "https://supratouch.dev",
		github: "https://github.com/drowningtoast",
		linkedin: "https://linkedin.com/in/supratouch",
		languages: [
			{ language: "Thai", level: "Native" },
			{ language: "English", level: "TOEIC 900" },
		],
	},

	sections: [
		{
			heading: "Experiences",
			entries: [
				{
					organization: "Honest Bank",
					role: "Backend Engineer, Fulltime",
					startDate: new Date("2026-03-01"),
					bullets: [
						"Primary engineer on a bank direct-debit product: built the Go partner API client, the GraphQL enrollment lifecycle, and a scheduled collection job with regulatory hours gating and row-level locking.",
						"Owned a regulatory compliance project end-to-end, design through production: an event-driven stamping pipeline in Go on Kafka and GCS, with retry/DLQ handling for vendor downtime and audit records in BigQuery.",
						"On-call for payment and card systems: triaged PagerDuty escalations to root cause via Grafana and Prometheus, then shipped five remediations across payment idempotency, error typing, and vendor-state recovery.",
					],
				},
				{
					organization: "Agoda",
					role: "Fullstack Software Engineer, Intern, Part-time",
					startDate: new Date("2025-06-01"),
					endDate: new Date("2025-12-01"),
					bullets: [
						"Led design reviews for the partner extranet convergence initiative, presenting API and frontend architecture proposals to 10–30 cross-functional stakeholders — directors, engineering managers, product owners, system maintainers.",
						"Migrated 5 high-traffic extranet pages (thousands of daily users) off the legacy monolith to microservices (React, C# .NET), including property-type-driven dynamic form configuration.",
						"Built out the testing diamond: unit tests for utilities, contract tests against third-party microservices, and end-to-end acceptance tests in production-like environments.",
						"Folded review feedback back into the designs, including migrating to newer API endpoints surfaced by stakeholders.",
					],
				},
				{
					organization: "Cleverse",
					role: "Software Engineer, Intern, Part-time",
					startDate: new Date("2024-04-01"),
					endDate: new Date("2025-02-01"),
					bullets: [
						"Architected a Bitcoin wallet auth library: one adapter pattern covering 4 providers, giving several Web3 apps a single signature-based login path.",
						"Built a Bitcoin NFT launch platform that sold out its first round (tens of thousands of dollars), using the Mempool API for transaction management and investor verification.",
						"Shipped core DEX features — liquidity pool management and token swapping — for a Uniswap V2/V3 fork on Mantle.",
						"Extended a smart-money tracking platform (20K+ users) from Ethereum to Solana, adding wallet analytics and transaction history views.",
					],
				},
				{
					organization: "School of Information Technology, KMITL",
					role: "Teaching Assistant",
					startDate: new Date("2023-07-01"),
					endDate: new Date("2024-02-01"),
					bullets: [
						"Mentored 100+ students across Problem Solving (Python), Object-Oriented Programming (Java), and IT Fundamentals (Git, Linux).",
					],
				},
			],
		},

		{
			heading: "Projects",
			entries: [
				{
					organization: "KMITL Curriculum Website",
					role: "Leads Fullstack Engineer",
					url: "https://curriculum.kmitl.ac.th",
					startDate: new Date("2025-04-01"),
					endDate: new Date("2025-05-01"),
					bullets: [
						"Led 1-month development of university curriculum platform (100+ programs) with Astro and PayloadCMS, managing a junior developer on WordPress migration and presenting to institutional directors",
					],
				},
				{
					organization: "ITKMITL TCAS",
					role: "System Maintainer",
					url: "https://tcas.it.kmitl.ac.th",
					startDate: new Date("2023-09-01"),
					endDate: new Date("2025-08-01"),
					bullets: [
						"Rescued non-operational admissions platform (500+ students) by delivering emergency Svelte rewrite in 2–4 weeks, eliminating 6+ years of technical debt (Vue 2, Node 12, Sequelize). Modernized to Next.js with hybrid SSR/CSR and Prisma ORM; built staff portal for application review and applicant management",
					],
				},
			],
		},

		{
			heading: "Leadership & Activities",
			entries: [
				{
					organization: "IT Experience Club",
					role: "Vice-President",
					startDate: new Date("2023-07-01"),
					endDate: new Date("2024-02-01"),
					bullets: [
						"Organized technology workshops for 200+ students including Python project-building workshops for first-year students",
					],
				},
				{
					organization: "Junior Webmaster Camp 13",
					role: "Programming Class Teaching Director, Frontend Developer",
					url: "https://13.jwc.in.th/",
					// One-off camp: same start and end month collapses to "Jul 2024".
					startDate: new Date("2024-07-01"),
					endDate: new Date("2024-07-01"),
					bullets: [
						"Instructed 48 selected high school students in advanced fullstack development and developer–designer collaboration",
						"Led frontend development team and created interactive camp website with engaging user experience",
					],
				},
				{
					// Web-only: the PDF is deliberately held to one page.
					organization: "Young Webmaster Camp 19",
					role: "Participant",
					startDate: new Date("2023-07-01"),
					endDate: new Date("2023-07-01"),
					inResume: false,
					bullets: ["Selected as 1 of 20 participants from 371 applicants."],
				},
				{
					organization: "ToBeIT'67 Camp",
					role: "Web Development Instructor",
					startDate: new Date("2023-10-01"),
					endDate: new Date("2023-11-01"),
					inResume: false,
					bullets: [
						"Taught web development (SvelteKit, Express.js, JavaScript) to 1,000+ students.",
					],
				},
				{
					organization: "Sairahut IT20",
					role: "Development Team Lead",
					startDate: new Date("2023-07-01"),
					endDate: new Date("2023-08-01"),
					inResume: false,
					bullets: [
						"Led development team for faculty event with 250 peak concurrent users.",
					],
				},
			],
		},
	],

	education: [
		{
			institution: "King Mongkut's Institute of Technology Ladkrabang",
			location: "Ladkrabang, Bangkok",
			degree:
				"Bachelor of Science, School of Information Technology — Software Engineering Track",
			honors: "First Class Honours",
			gpa: "3.68",
			startDate: new Date("2022-06-01"),
			endDate: new Date("2026-03-01"),
		},
	],

	// Groups and the items inside them run most-used first — see `skillsNote`.
	// Reorder when the day job changes, not alphabetically.
	skills: [
		{
			label: "Languages",
			items: [
				"Go",
				"TypeScript",
				"SQL",
				"Python",
				"JavaScript",
				"Java",
				"C#",
				"C++",
			],
		},
		{
			label: "Backend",
			items: [
				"Kafka (Confluent, Avro)",
				"GraphQL",
				"Node.js",
				"Nest.js",
				"Express",
				"tRPC",
				"Prisma ORM",
				".NET",
				"Django",
			],
		},
		{
			label: "Databases",
			items: [
				"PostgreSQL",
				"BigQuery",
				"MySQL",
				"MongoDB",
				"MSSQL",
				"Cassandra",
			],
		},
		{
			label: "Infrastructure",
			items: [
				"Docker/Kubernetes",
				"Git",
				"Linux",
				"ArgoCD",
				"Terraform",
				"Vault",
				"GCS",
				"GrowthBook",
				"Microservices architecture",
				"Multi-datacenter deployment",
			],
		},
		{
			label: "Observability",
			items: ["Grafana", "Prometheus/PromQL", "PagerDuty", "Loki"],
		},
		{
			label: "Frontend",
			items: [
				"React",
				"Next.js",
				"Tailwind CSS",
				"Astro",
				"Svelte",
				"SvelteKit",
				"HTML5",
				"CSS3",
			],
		},
		{
			label: "Web3",
			items: [
				"Smart contract interaction",
				"Bitcoin wallet integration",
				"Web3.js/Ethers.js",
				"DeFi protocols",
			],
		},
	],

	skillsNote: "Ordered by what I reach for most, day to day.",
};

/** Entries that belong in the generated PDF. */
export function resumeEntries(section: ResumeSection): ResumeEntry[] {
	return section.entries.filter((entry) => entry.inResume !== false);
}

export function findSection(heading: string): ResumeSection {
	const section = Resume.sections.find((s) => s.heading === heading);
	if (!section) throw new Error(`Unknown résumé section: ${heading}`);
	return section;
}
