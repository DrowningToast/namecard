import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Build-time check only — Astro frontmatter runs on the server.
 *
 * `public/resume.pdf` is produced by `pnpm resume:pdf`, which needs a local
 * LaTeX engine. Until someone runs it, the download affordance stays hidden
 * rather than linking at a 404.
 *
 * Resolved from `process.cwd()`, not `import.meta.url`: Vite rewrites the
 * latter to the bundled chunk's location under `dist/server/`, so a path
 * relative to this source file silently misses during `astro build`.
 */
export const RESUME_PDF_HREF = "/resume.pdf";

export const resumePdfExists = existsSync(
	join(process.cwd(), "public", "resume.pdf"),
);
