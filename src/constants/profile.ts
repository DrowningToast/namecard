import { Resume } from "@/data/resume";

/**
 * Kept as a named export for `SEO.astro` and `api/og.ts`. `title` is the
 * résumé's tagline under a legacy name.
 */
export const Profile = {
	...Resume.profile,
	title: Resume.profile.tagline,
} as const;
