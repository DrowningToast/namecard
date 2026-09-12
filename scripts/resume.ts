#!/usr/bin/env node
/**
 * Renders `src/data/resume.ts` to LaTeX, and optionally to a PDF.
 *
 *   pnpm resume:tex             → build/resume.tex
 *   pnpm resume:pdf             → build/resume.tex + public/resume.pdf
 *   pnpm resume:check           → exit 1 if the committed .tex is stale
 *   node scripts/resume.ts --out ../cv/resume.tex
 *
 * Runs under bare Node (v22.6+ strips the types), so it takes no dependency on
 * the Astro/Vite toolchain and adds nothing to package.json.
 */

import { execFileSync } from "node:child_process";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { Resume } from "../src/data/resume.ts";
import { renderLatex } from "./lib/to-latex.ts";

const ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_TEX = join(ROOT, "build", "resume.tex");
const PDF_TARGET = join(ROOT, "public", "resume.pdf");

/** Ordered by preference: tectonic is self-contained and needs no TeX install. */
const ENGINES = [
	{ bin: "tectonic", args: (tex: string) => [tex] },
	{ bin: "latexmk", args: (tex: string) => ["-pdf", "-interaction=nonstopmode", tex] },
	{ bin: "pdflatex", args: (tex: string) => ["-interaction=nonstopmode", tex] },
];

function parseArgs(argv: string[]) {
	const outIndex = argv.indexOf("--out");
	return {
		pdf: argv.includes("--pdf"),
		check: argv.includes("--check"),
		out: outIndex === -1 ? DEFAULT_TEX : resolve(argv[outIndex + 1]),
	};
}

/** PATH scan rather than spawning `command -v` through a shell. */
function onPath(bin: string): boolean {
	const extensions =
		process.platform === "win32"
			? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";")
			: [""];

	return (process.env.PATH ?? "")
		.split(delimiter)
		.filter(Boolean)
		.some((dir) =>
			extensions.some((ext) => existsSync(join(dir, `${bin}${ext}`))),
		);
}

function findEngine() {
	return ENGINES.find((engine) => onPath(engine.bin)) ?? null;
}

function compile(texPath: string) {
	const engine = findEngine();
	if (!engine) {
		console.error(
			[
				"No LaTeX engine found (looked for tectonic, latexmk, pdflatex).",
				"",
				"  brew install tectonic     # ~50 MB, self-contained, fetches packages on demand",
				"",
				`The LaTeX source is written and valid at ${texPath} — only the PDF step is blocked.`,
			].join("\n"),
		);
		process.exit(1);
	}

	// Build in a temp dir so .aux/.log/.out never land in the repo.
	const work = mkdtempSync(join(tmpdir(), "resume-"));
	try {
		const scratchTex = join(work, "resume.tex");
		copyFileSync(texPath, scratchTex);

		console.log(`Compiling with ${engine.bin}…`);
		execFileSync(engine.bin, engine.args(scratchTex), {
			cwd: work,
			stdio: "inherit",
		});

		const produced = join(work, "resume.pdf");
		if (!existsSync(produced)) {
			console.error(`${engine.bin} exited cleanly but produced no PDF.`);
			process.exit(1);
		}

		mkdirSync(dirname(PDF_TARGET), { recursive: true });
		copyFileSync(produced, PDF_TARGET);
		console.log(`Wrote ${PDF_TARGET}`);
	} finally {
		rmSync(work, { recursive: true, force: true });
	}
}

function main() {
	const { pdf, check, out } = parseArgs(process.argv.slice(2));
	const latex = renderLatex(Resume);

	if (check) {
		const stale = !existsSync(out) || readFileSync(out, "utf8") !== latex;
		if (stale) {
			console.error(
				`${out} is out of date with src/data/resume.ts — run \`pnpm resume:tex\`.`,
			);
			process.exit(1);
		}
		console.log(`${out} is up to date.`);
		return;
	}

	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, latex, "utf8");
	console.log(`Wrote ${out} (${latex.split("\n").length} lines)`);

	if (pdf) compile(out);
}

main();
