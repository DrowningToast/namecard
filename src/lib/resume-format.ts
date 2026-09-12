/**
 * Date formatting shared by the web résumé and the LaTeX generator.
 *
 * Deliberately import-free: `scripts/lib/to-latex.ts` pulls this in over a
 * relative path under bare Node, which resolves no bundler aliases.
 *
 * All readers are UTC. The dates in `src/data/resume.ts` are written as
 * `new Date("2026-03-01")`, i.e. UTC midnight — reading them with local
 * getters renders "Feb 2026" for anyone west of Greenwich.
 *
 * Ranges use a real en-dash. `escapeLatex` maps it to `--`.
 */

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function formatMonthYear(date: Date): string {
	return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * No `endDate` means ongoing. An `endDate` in the same month as `startDate`
 * means a one-off — a camp, a workshop — and collapses to a single label
 * rather than "Jul 2024 – Jul 2024".
 */
export function formatRange(
	startDate?: Date,
	endDate?: Date,
	presentLabel = "Now",
): string {
	if (!startDate) return endDate ? formatMonthYear(endDate) : "";
	const start = formatMonthYear(startDate);
	if (!endDate) return `${start} – ${presentLabel}`;
	const end = formatMonthYear(endDate);
	return start === end ? start : `${start} – ${end}`;
}

export function formatYearRange(startDate: Date, endDate: Date): string {
	return `${startDate.getUTCFullYear()} – ${endDate.getUTCFullYear()}`;
}

/** "https://supratouch.dev" → "supratouch.dev" — link text, not the target. */
export function stripScheme(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** [{Thai, Native}, {English, TOEIC 900}] → "Native Thai, English (TOEIC 900)" */
export function formatLanguages(
	languages: { language: string; level: string }[],
): string {
	return languages
		.map(({ language, level }) =>
			level === "Native" ? `Native ${language}` : `${language} (${level})`,
		)
		.join(", ");
}
