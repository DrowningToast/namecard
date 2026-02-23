import type { SectionViewModel } from "@/components/landing/Section";

export const Projects: SectionViewModel[] = [
	{
		title: "KMITL Curriculum Website",
		url: "https://curriculum.kmitl.ac.th",
		subnodes: [
			{
				title: "Leads Fullstack Engineer",
				description:
					"Led 1-month development of university curriculum platform (100+ programs) with Astro and PayloadCMS, managing junior developer and presenting to institutional directors.",
				startDate: new Date("2025-04-01"),
				endDate: new Date("2025-05-01"),
			},
		],
	},
	{
		title: "ITKMITL TCAS",
		url: "https://tcas.it.kmitl.ac.th",
		subnodes: [
			{
				title: "System Maintainer",
				description:
					"Rescued admissions platform (500+ students) with emergency Svelte rewrite, then modernized to Next.js with Prisma ORM and built a staff portal for application management.",
				startDate: new Date("2023-09-01"),
				endDate: new Date("2025-08-01"),
			},
		],
	},
];
