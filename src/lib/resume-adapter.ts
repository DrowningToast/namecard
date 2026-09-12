import type { SectionViewModel } from "@/components/landing/Section";
import type { EducationEntry, ResumeEntry, ResumeSection } from "@/data/resume";

/**
 * Projects the résumé model down onto the landing page's `SectionViewModel`.
 *
 * Bullets pass through as a list rather than being flattened into prose, so
 * the landing page and the résumé paper show the same shape. Dates live on the
 * subnode because that is where `Section/index.tsx` formats them.
 */
export function toSectionViewModels(
	section: ResumeSection,
): SectionViewModel[] {
	return section.entries.map(toSectionViewModel);
}

function toSectionViewModel(entry: ResumeEntry): SectionViewModel {
	return {
		title: entry.organization,
		url: entry.url,
		subnodes: [
			{
				title: entry.role ?? entry.organization,
				bullets: entry.bullets.length > 0 ? entry.bullets : undefined,
				startDate: entry.startDate,
				endDate: entry.endDate,
			},
		],
	};
}

export function educationToSectionViewModels(
	entries: EducationEntry[],
): SectionViewModel[] {
	return entries.map((entry) => ({
		title: entry.institution,
		subnodes: [
			{
				title: entry.degree,
				description: [
					entry.honors,
					entry.gpa ? `GPA ${entry.gpa}` : null,
					entry.location,
				]
					.filter(Boolean)
					.join(" · "),
				startDate: entry.startDate,
				endDate: entry.endDate,
			},
		],
	}));
}
