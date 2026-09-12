import { describe, expect, it } from "vitest";
import { escapeLatex, renderLatex } from "../scripts/lib/to-latex.ts";
import { Resume, type ResumeData } from "@/data/resume";
import { PHONE_LIKE } from "./helpers.ts";

describe("escapeLatex", () => {
	it("escapes the LaTeX special characters", () => {
		expect(escapeLatex("a & b")).toBe("a \\& b");
		expect(escapeLatex("96%")).toBe("96\\%");
		expect(escapeLatex("C#")).toBe("C\\#");
		expect(escapeLatex("$100")).toBe("\\$100");
		expect(escapeLatex("snake_case")).toBe("snake\\_case");
		expect(escapeLatex("{braced}")).toBe("\\{braced\\}");
		expect(escapeLatex("2^10")).toBe("2\\^{}10");
	});

	it("renders a tilde as the math approximation sign", () => {
		expect(escapeLatex("~96%")).toBe("$\\sim$96\\%");
	});

	it("does not re-escape the output of an earlier replacement", () => {
		// The regression this guards: chained .replace() calls would turn the `$`
		// and `\` emitted by the tilde rule into `\$` and `\textbackslash{}`.
		expect(escapeLatex("~")).toBe("$\\sim$");
		expect(escapeLatex("~ & ~")).toBe("$\\sim$ \\& $\\sim$");
	});

	it("converts Unicode dashes to their LaTeX ligatures", () => {
		expect(escapeLatex("10–30")).toBe("10--30");
		expect(escapeLatex("IT — Software")).toBe("IT --- Software");
	});

	it("passes ordinary prose through untouched", () => {
		const prose = "Led 1-month development of a platform (100+ programs).";
		expect(escapeLatex(prose)).toBe(prose);
	});

	it("escapes a literal backslash", () => {
		expect(escapeLatex("a\\b")).toBe("a\\textbackslash{}b");
	});
});

describe("renderLatex", () => {
	const latex = renderLatex(Resume);

	it("produces a complete document", () => {
		expect(latex).toContain("\\documentclass[letterpaper,9pt]{extarticle}");
		expect(latex).toContain("\\begin{document}");
		expect(latex.trimEnd().endsWith("\\end{document}")).toBe(true);
	});

	it("keeps the hand-tuned macros from the preamble", () => {
		expect(latex).toContain("\\newcommand{\\entry}[2]{%");
		expect(latex).toContain("\\newcommand{\\entrylink}[4]{%");
		expect(latex).toContain("\\newcommand{\\role}[1]{(\\textit{#1})}");
	});

	it("escapes the ampersand in a section heading", () => {
		expect(latex).toContain("\\section{Leadership \\& Activities}");
	});

	it("emits an ongoing role with no end date", () => {
		expect(latex).toContain(
			"\\entry{Honest Bank \\role{Backend Engineer, Fulltime}}{Mar 2026 -- Now}",
		);
	});

	it("emits a linked entry with the URL as both label and target", () => {
		expect(latex).toContain(
			"\\entrylink{ITKMITL TCAS \\role{System Maintainer}}{https://tcas.it.kmitl.ac.th}{https://tcas.it.kmitl.ac.th}{Sep 2023 -- Aug 2025}",
		);
	});

	it("renders email, site, GitHub and LinkedIn — but never a phone number", () => {
		expect(latex).toContain("\\href{mailto:su.suwatno@gmail.com}");
		expect(latex).toContain("\\href{https://github.com/drowningtoast}");
		expect(latex).toContain("\\href{https://linkedin.com/in/supratouch}");
		// The PDF gets attached to applications and posted publicly; a stray
		// phone number in the generated source is a leak.
		expect(latex).not.toMatch(PHONE_LIKE);
	});

	it("leaves the href target unescaped", () => {
		// A naive escape pass would mangle the URL inside \href{}.
		expect(latex).not.toContain("\\href{https://supratouch.dev\\");
		expect(latex).toContain("\\href{https://linkedin.com/in/supratouch}");
	});

	it("omits entries flagged out of the résumé", () => {
		// Web-only activities exist in the data but must not reach the PDF,
		// which is deliberately held to one page.
		expect(latex).not.toContain("Young Webmaster Camp 19");
		expect(latex).not.toContain("ToBeIT");
		expect(latex).not.toContain("Sairahut IT20");
		// ...while the résumé-worthy sibling in the same section survives.
		expect(latex).toContain("Junior Webmaster Camp 13");
	});

	it("lays the skills out three to a row", () => {
		expect(latex).toContain(
			"\\begin{tabularx}{\\textwidth}{@{}S @{\\hspace{1.4em}} S @{\\hspace{1.4em}} S@{}}",
		);
		expect(latex).toContain("\\textbf{Languages:}");
		expect(latex).toContain("\\textbf{Web3:}");
	});

	it("nests the year range inside the education bullet", () => {
		expect(latex).toContain(
			"      Bachelor of Science, School of Information Technology --- Software Engineering Track. First Class Honours. GPA 3.68 & 2022 -- 2026 \\\\",
		);
	});

	it("pads a partial skills row rather than emitting ragged columns", () => {
		const twoGroups: ResumeData = {
			...Resume,
			sections: [],
			skills: [
				{ label: "Languages", items: ["Go"] },
				{ label: "Backend", items: ["Node.js"] },
			],
		};
		// Two groups in a three-column grid ⇒ one empty trailing cell.
		expect(renderLatex(twoGroups)).toContain(
			"  \\textbf{Languages:} Go &\n  \\textbf{Backend:} Node.js &\n   \\\\",
		);
	});
});
