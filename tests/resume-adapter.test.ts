import { describe, expect, it } from "vitest";
import type { ResumeSection } from "@/data/resume";
import { Resume, findSection, resumeEntries } from "@/data/resume";
import {
	educationToSectionViewModels,
	toSectionViewModels,
} from "@/lib/resume-adapter";

const section = (entries: ResumeSection["entries"]): ResumeSection => ({
	heading: "Test",
	entries,
});

describe("toSectionViewModels", () => {
	it("nests the role under the organisation, with the dates on the subnode", () => {
		const [vm] = toSectionViewModels(
			section([
				{
					organization: "Honest Bank",
					role: "Backend Engineer",
					startDate: new Date("2026-03-01"),
					bullets: ["Shipped a thing"],
				},
			]),
		);

		expect(vm.title).toBe("Honest Bank");
		expect(vm.subnodes).toHaveLength(1);
		expect(vm.subnodes?.[0].title).toBe("Backend Engineer");
		// Section/index.tsx formats dates off the subnode, not the parent.
		expect(vm.subnodes?.[0].startDate).toEqual(new Date("2026-03-01"));
		expect(vm.startDate).toBeUndefined();
	});

	it("passes bullets through as a list rather than flattening to prose", () => {
		const [vm] = toSectionViewModels(
			section([
				{ organization: "Cleverse", bullets: ["Did one thing", "Did another"] },
			]),
		);
		expect(vm.subnodes?.[0].bullets).toEqual(["Did one thing", "Did another"]);
		// Description is the prose-only path, used by hand-authored side projects.
		expect(vm.subnodes?.[0].description).toBeUndefined();
	});

	it("omits bullets entirely when the entry has none", () => {
		// Description renders nothing rather than an empty <ul>.
		const [vm] = toSectionViewModels(
			section([{ organization: "Solo Project", bullets: [] }]),
		);
		expect(vm.subnodes?.[0].bullets).toBeUndefined();
	});

	it("falls back to the organisation when there is no role", () => {
		const [vm] = toSectionViewModels(
			section([{ organization: "Solo Project", bullets: [] }]),
		);
		expect(vm.subnodes?.[0].title).toBe("Solo Project");
	});

	it("keeps web-only entries, unlike the résumé renderer", () => {
		const input = section([
			{ organization: "Shown everywhere", bullets: [] },
			{ organization: "Web only", bullets: [], inResume: false },
		]);
		expect(toSectionViewModels(input)).toHaveLength(2);
		expect(resumeEntries(input)).toHaveLength(1);
	});
});

describe("educationToSectionViewModels", () => {
	it("builds the GPA and location into the description", () => {
		const [vm] = educationToSectionViewModels(Resume.education);
		expect(vm.title).toBe("King Mongkut's Institute of Technology Ladkrabang");
		expect(vm.subnodes?.[0].description).toBe("GPA 3.68 · Ladkrabang, Bangkok");
	});
});

describe("findSection", () => {
	it("returns the named section", () => {
		expect(findSection("Experiences").entries.length).toBeGreaterThan(0);
	});

	it("throws on a typo rather than silently rendering nothing", () => {
		expect(() => findSection("Experience")).toThrow(/Unknown résumé section/);
	});
});

describe("the landing page constants stay wired to the résumé data", () => {
	it("derives every section from src/data/resume.ts", async () => {
		const { WorkExperience } = await import("@/constants/work-experience");
		const { Projects } = await import("@/constants/projects");
		const { Activities } = await import("@/constants/activities");
		const { Education } = await import("@/constants/education");

		expect(WorkExperience.map((v) => v.title)).toEqual(
			findSection("Experiences").entries.map((e) => e.organization),
		);
		expect(Projects).toHaveLength(2);
		// Includes the three web-only entries the PDF drops.
		expect(Activities).toHaveLength(5);
		expect(Education).toHaveLength(1);
	});
});
