import { describe, expect, it } from "vitest";
import {
	formatLanguages,
	formatMonthYear,
	formatRange,
	formatYearRange,
	stripScheme,
} from "@/lib/resume-format";

describe("formatMonthYear", () => {
	it("abbreviates the month", () => {
		expect(formatMonthYear(new Date("2026-03-01"))).toBe("Mar 2026");
		expect(formatMonthYear(new Date("2025-12-01"))).toBe("Dec 2025");
	});

	it("reads dates as UTC so the label does not shift by viewer timezone", () => {
		// The data files write UTC midnight. Local getters would render "Feb 2026"
		// for anyone west of Greenwich, desyncing the site from the PDF.
		const utcMidnight = new Date("2026-03-01T00:00:00Z");
		expect(formatMonthYear(utcMidnight)).toBe("Mar 2026");

		const lastInstantOfMonth = new Date("2026-03-31T23:59:59Z");
		expect(formatMonthYear(lastInstantOfMonth)).toBe("Mar 2026");
	});
});

describe("formatRange", () => {
	it("joins a closed range with an en-dash", () => {
		expect(formatRange(new Date("2025-06-01"), new Date("2025-12-01"))).toBe(
			"Jun 2025 – Dec 2025",
		);
	});

	it("treats a missing end date as ongoing", () => {
		expect(formatRange(new Date("2026-03-01"))).toBe("Mar 2026 – Now");
	});

	it("honours a custom present label", () => {
		expect(formatRange(new Date("2026-03-01"), undefined, "Present")).toBe(
			"Mar 2026 – Present",
		);
	});

	it("collapses a same-month range to a single label", () => {
		// One-off events (camps, workshops) should read "Jul 2024", not
		// "Jul 2024 – Jul 2024" and emphatically not "Jul 2024 – Now".
		expect(formatRange(new Date("2024-07-01"), new Date("2024-07-01"))).toBe(
			"Jul 2024",
		);
	});

	it("returns an empty string when there are no dates", () => {
		expect(formatRange(undefined, undefined)).toBe("");
	});

	it("falls back to the end date alone when the start is missing", () => {
		expect(formatRange(undefined, new Date("2024-07-01"))).toBe("Jul 2024");
	});
});

describe("formatYearRange", () => {
	it("renders years with an en-dash", () => {
		expect(
			formatYearRange(new Date("2022-06-01"), new Date("2026-03-01")),
		).toBe("2022 – 2026");
	});
});

describe("stripScheme", () => {
	it("drops the protocol", () => {
		expect(stripScheme("https://supratouch.dev")).toBe("supratouch.dev");
		expect(stripScheme("http://example.com")).toBe("example.com");
	});

	it("drops a trailing slash", () => {
		expect(stripScheme("https://13.jwc.in.th/")).toBe("13.jwc.in.th");
	});

	it("leaves a bare host alone", () => {
		expect(stripScheme("supratouch.dev")).toBe("supratouch.dev");
	});
});

describe("formatLanguages", () => {
	it("puts a native level in front and parenthesises the rest", () => {
		expect(
			formatLanguages([
				{ language: "Thai", level: "Native" },
				{ language: "English", level: "TOEIC 900" },
			]),
		).toBe("Native Thai, English (TOEIC 900)");
	});
});
