import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
	EducationEntry,
	ResumeData,
	ResumeEntry,
	ResumeSection,
	SkillGroup,
} from "../../src/data/resume.ts";
import { resumeEntries } from "../../src/data/resume.ts";
import {
	formatLanguages,
	formatRange,
	formatYearRange,
	stripScheme,
} from "../../src/lib/resume-format.ts";

const SKILL_COLUMNS = 3;

const LATEX_ESCAPES: Record<string, string> = {
	"\\": "\\textbackslash{}",
	"&": "\\&",
	"%": "\\%",
	$: "\\$",
	"#": "\\#",
	_: "\\_",
	"{": "\\{",
	"}": "\\}",
	"^": "\\^{}",
	"~": "$\\sim$",
	"—": "---",
	"–": "--",
	"…": "\\ldots{}",
	"“": "``",
	"”": "''",
	"‘": "`",
	"’": "'",
};

/**
 * One pass, not chained `.replace()` calls — several replacements emit `\` and
 * `$` of their own (`~` → `$\sim$`), which a second pass would re-escape.
 */
export function escapeLatex(text: string): string {
	return text.replace(
		/[\\&%$#_{}^~—–…“”‘’]/g,
		(char) => LATEX_ESCAPES[char] ?? char,
	);
}

export function renderLatex(resume: ResumeData): string {
	const preamble = readFileSync(
		join(import.meta.dirname, "..", "templates", "preamble.tex"),
		"utf8",
	).trimEnd();

	return [
		preamble,
		"",
		"%==============================================================================",
		"\\begin{document}",
		"",
		renderHeading(resume),
		...resume.sections.map(renderSection),
		renderEducation(resume.education),
		renderSkills(resume.skills),
		"\\end{document}",
		"",
	].join("\n");
}

function renderHeading({ profile }: ResumeData): string {
	// Link text drops the scheme; the href target keeps it.
	const link = (url: string) =>
		`\\href{${url}}{${escapeLatex(stripScheme(url))}}`;

	return [
		"%--------------------------------------------------------------------- heading",
		"\\begin{tabularx}{\\textwidth}{@{}X r@{}}",
		`  {\\LARGE\\bfseries ${escapeLatex(profile.name)}} & ${escapeLatex(profile.location)} \\\\[0.35ex]`,
		`   & \\href{mailto:${profile.email}}{${escapeLatex(profile.email)}} \\\\[0.35ex]`,
		`   & ${link(profile.website)} \\quad ${link(profile.github)} \\quad`,
		`     ${link(profile.linkedin)} \\\\`,
		"\\end{tabularx}",
		"",
		"\\vspace{0.6ex}",
		"\\begin{tabularx}{\\textwidth}{@{}X r@{}}",
		`  ${escapeLatex(profile.tagline)} &`,
		`  Language: ${escapeLatex(formatLanguages(profile.languages))} \\\\`,
		"\\end{tabularx}",
		"",
	].join("\n");
}

function renderSection(section: ResumeSection): string {
	const entries = resumeEntries(section);
	return [
		rule(section.heading),
		`\\section{${escapeLatex(section.heading)}}`,
		"",
		...entries.map(renderEntry),
	].join("\n");
}

function renderEntry(entry: ResumeEntry): string {
	const title = entry.role
		? `${escapeLatex(entry.organization)} \\role{${escapeLatex(entry.role)}}`
		: escapeLatex(entry.organization);
	const date = escapeLatex(formatRange(entry.startDate, entry.endDate));

	// The href target stays raw — escaping would corrupt the URL.
	const head = entry.url
		? `\\entrylink{${title}}{${escapeLatex(entry.url)}}{${entry.url}}{${date}}`
		: `\\entry{${title}}{${date}}`;

	return [head, ...itemize(entry.bullets), ""].join("\n");
}

function renderEducation(entries: EducationEntry[]): string {
	return [
		rule("education"),
		"\\section{Education}",
		"",
		...entries.map((entry) => {
			const detail = [
				escapeLatex(entry.degree),
				entry.gpa ? `GPA ${escapeLatex(entry.gpa)}` : null,
			]
				.filter(Boolean)
				.join(". ");

			return [
				`\\entry{${escapeLatex(entry.institution)}}{${escapeLatex(entry.location)}}`,
				"\\begin{itemize}",
				"  \\item \\begin{tabularx}{\\linewidth}{@{}X r@{}}",
				`      ${detail} & ${escapeLatex(formatYearRange(entry.startDate, entry.endDate))} \\\\`,
				"    \\end{tabularx}",
				"\\end{itemize}",
				"",
			].join("\n");
		}),
	].join("\n");
}

function renderSkills(groups: SkillGroup[]): string {
	const rows = chunk(groups, SKILL_COLUMNS);
	const columnSpec = Array.from({ length: SKILL_COLUMNS }, () => "S").join(
		" @{\\hspace{1.4em}} ",
	);

	const body = rows.flatMap((row, index) => {
		const cells = Array.from({ length: SKILL_COLUMNS }, (_, column) => {
			const group = row[column];
			if (!group) return "";
			return `\\textbf{${escapeLatex(group.label)}:} ${escapeLatex(group.items.join(", "))}`;
		});
		// A blank line between rows keeps the generated source readable.
		const terminator = index === rows.length - 1 ? " \\\\" : " \\\\[1.0ex]";
		return [`  ${cells.join(" &\n  ")}${terminator}`, ""];
	});

	return [
		rule("technical skills"),
		"\\section{Technical Skills}",
		"",
		"\\vspace{0.4ex}",
		"\\newcolumntype{S}{>{\\raggedright\\arraybackslash}X}",
		`\\begin{tabularx}{\\textwidth}{@{}${columnSpec}@{}}`,
		...body.slice(0, -1),
		"\\end{tabularx}",
		"",
	].join("\n");
}

function itemize(bullets: string[]): string[] {
	if (bullets.length === 0) return [];
	return [
		"\\begin{itemize}",
		...bullets.map((bullet) => `  \\item ${escapeLatex(bullet)}`),
		"\\end{itemize}",
	];
}

function chunk<T>(items: T[], size: number): T[][] {
	const rows: T[][] = [];
	for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
	return rows;
}

/** Comment banner padded to 78 columns, matching the hand-written original. */
function rule(label: string): string {
	const text = ` ${label.toLowerCase()}`;
	return `%${"-".repeat(Math.max(1, 78 - 1 - text.length))}${text}`;
}
