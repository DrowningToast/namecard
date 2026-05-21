import type { SectionViewModel } from "@/components/landing/Section";

export const WorkExperience: SectionViewModel[] = [
	{
		title: "Honest Bank",
		subnodes: [
			{
				title: "Backend Engineer (Fulltime)",
				description:
					"Led design and delivery of an event-driven Kafka pipeline (Go, GCS, idempotent consumers, retry queue) for regulated e-document stamping at hundreds-of-thousands-per-year scale. Fixed upstream race condition causing approved-application state desync behind GrowthBook feature flag. Cut PagerDuty noise in payment/refund flows by reclassifying PromQL rules, eliminating recurring COE-P2 false alarms.",
				startDate: new Date("2026-03-01"),
			},
		],
	},
	{
		title: "Agoda",
		subnodes: [
			{
				title: "Fullstack Software Engineer (Intern)",
				description:
					"Migrated 5 high-traffic partner extranet pages from legacy monolith to microservices (React, C# .NET), built multi-region BFF layer, and led API design reviews with 10-30 cross-functional stakeholders.",
				startDate: new Date("2025-06-01"),
				endDate: new Date("2025-12-01"),
			},
		],
	},
	{
		title: "Cleverse",
		subnodes: [
			{
				title: "Software Engineer (Intern → Part-time)",
				description:
					"Architected Bitcoin wallet auth library for 4 providers, built NFT launch platform and DEX features on Bitcoin/Mantle, and extended smart money tracker to Solana for 20K+ users.",
				startDate: new Date("2024-04-01"),
				endDate: new Date("2025-02-01"),
			},
		],
	},
	{
		title: "School of Information Technology, KMITL",
		subnodes: [
			{
				title: "Teaching Assistant",
				description:
					"Mentored 100+ students in Problem Solving (Python), OOP (Java), and IT Fundamentals (Git, Linux) through hands-on coding sessions.",
				startDate: new Date("2023-07-01"),
				endDate: new Date("2024-02-01"),
			},
		],
	},
];
