import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderLatex } from "../scripts/lib/to-latex.ts";
import { Resume } from "@/data/resume";

/**
 * The content of `src/data/resume.ts` was transcribed by hand out of the
 * standalone `DrowningToast/cv` repo. `tests/fixtures/original-resume.tex` is
 * that pre-migration file, frozen.
 *
 * These tests compare the generator's output against an artifact it did not
 * produce, so they catch transcription slips a self-referential snapshot never
 * would. They are expected to fail the day the résumé content legitimately
 * changes — at which point re-bless the fixture deliberately, don't loosen the
 * assertion.
 *
 * One edit to the fixture: the phone number in the header is replaced with
 * "[phone redacted]". It is deliberately absent from the current résumé, and a
 * committed fixture is still published content.
 */

const original = readFileSync(
	join(import.meta.dirname, "fixtures", "original-resume.tex"),
	"utf8",
);
const generated = renderLatex(Resume);

/**
 * Entries whose copy has been deliberately rewritten since the migration.
 * Their bullets are exempt from the verbatim check — everything else still has
 * to match. Add to this list only alongside an intentional content change.
 */
const REVISED = [
	"Honest Bank",
	// Bullets condensed for length; the underlying facts are unchanged.
	"Agoda",
	"Cleverse",
	"School of Information Technology, KMITL",
];

/**
 * Original `\entry`/`\entrylink` headings mapped to their bullets. Parsing per
 * entry (rather than one flat list) is what lets a single rewritten role be
 * exempted without blinding the check for the other eight.
 */
function entriesOf(latex: string): Map<string, string[]> {
	const entries = new Map<string, string[]>();
	let current: string | null = null;

	for (const raw of latex.split("\n")) {
		const line = raw.trim();
		if (line.startsWith("\\entry")) {
			// `\entry{Org \role{...}}{date}` → "Org"
			current = line.slice(line.indexOf("{") + 1).split(/\s*\\role|}/)[0];
			entries.set(current, []);
		} else if (line.startsWith("\\item ") && !line.includes("tabularx")) {
			current && entries.get(current)?.push(line.slice("\\item ".length));
		}
	}
	return entries;
}

describe("migration fidelity", () => {
	it("carries over every bullet verbatim, except deliberately revised roles", () => {
		const before = entriesOf(original);
		expect(before.size).toBe(9);

		const checked = [...before].filter(([org]) => !REVISED.includes(org));
		expect(checked).toHaveLength(5);

		// 17 bullets originally, minus the 12 belonging to REVISED roles (Honest
		// Bank 3, Agoda 4, Cleverse 4, teaching assistant 1). The education entry
		// contributes none — its detail line is a nested tabularx, not an \item.
		const bullets = checked.flatMap(([, items]) => items);
		expect(bullets).toHaveLength(5);

		for (const bullet of bullets) {
			expect(generated).toContain(`\\item ${bullet}`);
		}
	});

	it("still renders the revised roles, with new copy", () => {
		for (const org of REVISED) {
			expect(generated).toContain(org);
			for (const bullet of entriesOf(original).get(org) ?? []) {
				expect(generated).not.toContain(`\\item ${bullet}`);
			}
		}
	});

	it("preserves the preamble byte-for-byte", () => {
		// Everything from \documentclass to \begin{document} is hand-tuned
		// typesetting — spacing, rules, list geometry. The generator must not
		// paraphrase it.
		const preambleOf = (latex: string) =>
			latex.slice(
				latex.indexOf("\\documentclass"),
				latex.indexOf("\\begin{document}"),
			);
		expect(preambleOf(generated)).toBe(preambleOf(original));
	});

	it("preserves every section heading", () => {
		for (const heading of [
			"\\section{Experiences}",
			"\\section{Projects}",
			"\\section{Leadership \\& Activities}",
			"\\section{Education}",
			"\\section{Technical Skills}",
		]) {
			expect(original).toContain(heading);
			expect(generated).toContain(heading);
		}
	});

	it("preserves every organisation and role", () => {
		// Matches both \entry and \entrylink: 6 plain + 3 linked.
		const roleLines = original
			.split("\n")
			.filter((line) => line.startsWith("\\entry"))
			// Strip the trailing `{date}` argument: dates are intentionally
			// reformatted ("March 2026" → "Mar 2026").
			.map((line) => line.slice(0, line.lastIndexOf("{")));

		expect(roleLines).toHaveLength(9);
		for (const line of roleLines) {
			expect(generated).toContain(line);
		}
	});

	it("preserves every link target", () => {
		const urls = [...original.matchAll(/\\href\{([^}]+)\}/g)].map((m) => m[1]);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(generated).toContain(`\\href{${url}}`);
		}
	});

	it("preserves the skills grid contents", () => {
		for (const group of Resume.skills) {
			const cell = `\\textbf{${group.label}:} ${group.items.join(", ").replace(/#/g, "\\#")}`;
			expect(original).toContain(cell);
			expect(generated).toContain(cell);
		}
	});

	it("reformats dates and nothing else", () => {
		// The only expected divergence in the body. Guards against a future
		// change quietly rewording a bullet under cover of "formatting".
		expect(original).toContain("{March 2026 -- Now}");
		expect(generated).toContain("{Mar 2026 -- Now}");
		expect(generated).not.toContain("{March 2026 -- Now}");
	});
});
