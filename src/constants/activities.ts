import type { SectionViewModel } from "@/components/landing/Section";

export const Activities: SectionViewModel[] = [
	{
		title: "IT Experience Club",
		subnodes: [
			{
				title: "Vice-President",
				description:
					"Organized technology workshops for 200+ students including Python project-building workshops for first-year students.",
				startDate: new Date("2023-07-01"),
				endDate: new Date("2024-02-01"),
			},
		],
	},
	{
		title: "Junior Webmaster Camp 13",
		url: "https://13.jwc.in.th/",
		startDate: new Date("2024-07-01"),
		subnodes: [
			{
				title: "Programming Class Teaching Director & Frontend Developer",
				description:
					"Instructed 48 selected high school students in fullstack development and led the frontend team to build the interactive camp website.",
			},
		],
	},
	{
		title: "Young Webmaster Camp 19",
		startDate: new Date("2023-07-01"),
		subnodes: [
			{
				title: "Participant",
				description: "Selected as 1 of 20 participants from 371 applicants.",
			},
		],
	},
	{
		title: "ToBeIT'67 Camp",
		startDate: new Date("2023-10-01"),
		endDate: new Date("2023-11-01"),
		subnodes: [
			{
				title: "Web Development Instructor",
				description:
					"Taught web development (SvelteKit, Express.js, JavaScript) to 1,000+ students.",
			},
		],
	},
	{
		title: "Sairahut IT20",
		startDate: new Date("2023-07-01"),
		endDate: new Date("2023-08-01"),
		subnodes: [
			{
				title: "Development Team Lead",
				description:
					"Led development team for faculty event with 250 peak concurrent users.",
			},
		],
	},
];
