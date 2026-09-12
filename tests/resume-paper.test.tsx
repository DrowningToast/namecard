import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { Resume } from "@/data/resume";
import { PHONE_LIKE } from "./helpers.ts";

/**
 * `ResumePaper` carries no `client:*` directive, so this static render is
 * exactly what ships. Nothing here should require a DOM.
 */
const html = renderToStaticMarkup(<ResumePaper resume={Resume} />);

describe("ResumePaper", () => {
	it("escapes the global pixel font", () => {
		// global.css forces `font-sans` (GeistPixelLine) on <html>. Without this
		// class the résumé renders in a pixel face.
		expect(html).toContain("font-resume");
	});

	it("renders the contact details the landing page does not carry", () => {
		expect(html).toContain("su.suwatno@gmail.com");
		expect(html).toContain("github.com/drowningtoast");
		expect(html).toContain("linkedin.com/in/supratouch");
		expect(html).toContain("Native Thai, English (TOEIC 900)");
	});

	it("never publishes a phone number", () => {
		// This page is served at a public URL and committed to a public repo.
		expect(html).not.toMatch(PHONE_LIKE);
	});

	it("renders every résumé section heading", () => {
		for (const heading of [
			"Experiences",
			"Projects",
			"Leadership &amp; Activities",
			"Education",
			"Technical Skills",
		]) {
			expect(html).toContain(heading);
		}
	});

	it("renders one <li> per bullet", () => {
		expect(html).toContain("Owned a regulatory compliance project end-to-end");
		const bullets = Resume.sections
			.flatMap((s) => s.entries)
			.filter((e) => e.inResume !== false)
			.reduce((n, e) => n + e.bullets.length, 0);
		// Education contributes one more <li> (the degree line).
		expect(html.match(/<li/g) ?? []).toHaveLength(bullets + 1);
	});

	it("omits entries flagged out of the résumé", () => {
		// The paper is a résumé, so `inResume: false` applies here exactly as it
		// does to the PDF — these three are landing-page-only.
		expect(html).not.toContain("Young Webmaster Camp 19");
		expect(html).not.toContain("ToBeIT");
		expect(html).not.toContain("Sairahut IT20");
		expect(html).toContain("Junior Webmaster Camp 13");
	});

	it("renders the same dates as the LaTeX generator", () => {
		expect(html).toContain("Mar 2026 – Now");
		expect(html).toContain("Jun 2025 – Dec 2025");
		// One-off camp, collapsed rather than shown as an open-ended range.
		expect(html).toContain("Jul 2024");
		expect(html).not.toContain("Jul 2024 – Jul 2024");
	});

	it("renders education with GPA and year range", () => {
		expect(html).toContain("GPA 3.68");
		expect(html).toContain("2022 – 2026");
	});

	it("renders all six skill groups", () => {
		for (const group of Resume.skills) {
			expect(html).toContain(`${group.label}:`);
		}
	});

	it("opens external links safely", () => {
		expect(html).toContain('rel="noopener noreferrer"');
	});
});
