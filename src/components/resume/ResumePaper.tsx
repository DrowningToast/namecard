import type {
	EducationEntry,
	ResumeData,
	ResumeEntry,
	ResumeSection,
	SkillGroup,
} from "@/data/resume";
import { resumeEntries } from "@/data/resume";
import {
	formatLanguages,
	formatRange,
	formatYearRange,
	stripScheme,
} from "@/lib/resume-format";
import { cn } from "@/lib/utils";
import type React from "react";

/**
 * HTML recreation of `scripts/templates/preamble.tex` — same data, same visual
 * grammar, reflowing instead of paginating.
 *
 * No hooks and no state, so Astro renders it to static HTML and ships zero JS.
 * Do not add interactivity without also adding a `client:*` directive.
 */

const RULE = "border-b border-current/25";

export const ResumePaper: React.FC<{ resume: ResumeData; className?: string }> = ({
	resume,
	className,
}) => (
	<article
		className={cn(
			// `font-resume` escapes the global pixel face; children inherit it.
			// Everything below sizes in `em`/`ex`, so this one clamp scales the whole
			// sheet with the viewport: 15px once the paper hits its 10in cap (~992px,
			// the LaTeX proportions exactly), easing down to a readable 11px on phones.
			"font-resume text-[clamp(11px,8.3px_+_0.68vw,15px)] leading-snug",
			"bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100",
			// Wider than Letter on screen for readability; print still lays out at 8.5in.
			"mx-auto w-full max-w-[10in] rounded-sm shadow-lg",
			"p-[1.9em] sm:p-[3.4em]",
			"print:max-w-none print:rounded-none print:p-0 print:shadow-none",
			"print:text-[9.5pt]",
			"print:bg-white print:text-black",
			className,
		)}
	>
		<Heading resume={resume} />
		{resume.sections.map((section) => (
			<Section key={section.heading} section={section} />
		))}
		<Education entries={resume.education} />
		<Skills groups={resume.skills} />
	</article>
);

const Heading: React.FC<{ resume: ResumeData }> = ({ resume: { profile } }) => (
	<header>
		{/* Stacks on phones; the LaTeX name/contact two-column split needs width. */}
		<div className="flex flex-col gap-[0.3em] sm:flex-row sm:items-start sm:justify-between sm:gap-[1.9em]">
			{/* Sizes below are `em` ratios of the LaTeX 9.5pt base: 17pt, 12pt, 8.5pt. */}
			<div>
				<h1 className="text-[1.79em] font-bold leading-tight">{profile.name}</h1>
				<p>
					<Link href={profile.website}>{stripScheme(profile.website)}</Link>
				</p>
			</div>
			<div className="sm:text-right">
				<p>{profile.location}</p>
				<p>
					<Link href={`mailto:${profile.email}`}>{profile.email}</Link>
				</p>
				<p>
					<Link href={profile.github}>{stripScheme(profile.github)}</Link>
					<Gap />
					<Link href={profile.linkedin}>{stripScheme(profile.linkedin)}</Link>
				</p>
			</div>
		</div>
		<div className="mt-[0.5em] flex flex-col gap-[0.15em] sm:flex-row sm:justify-between sm:gap-[1.9em]">
			<p>{profile.tagline}</p>
			<p className="sm:text-right">
				Language: {formatLanguages(profile.languages)}
			</p>
		</div>
	</header>
);

const Section: React.FC<{ section: ResumeSection }> = ({ section }) => (
	<section>
		<SectionHeading>{section.heading}</SectionHeading>
		{/* The paper is a résumé, so `inResume: false` applies here exactly as it
		    does to the PDF — those entries are landing-page-only. */}
		{resumeEntries(section).map((entry) => (
			<Entry key={`${entry.organization}-${entry.role}`} entry={entry} />
		))}
	</section>
);

const Entry: React.FC<{ entry: ResumeEntry }> = ({ entry }) => (
	<div className="mt-[0.6ex]">
		<div className="flex flex-wrap items-baseline justify-between gap-x-[0.95em]">
			<h3 className="font-bold">
				{entry.organization}
				{entry.role ? (
					<span className="font-normal italic"> ({entry.role})</span>
				) : null}
				{entry.url ? (
					<Link href={entry.url} className="ml-[0.6em] text-[0.9em] font-normal">
						{stripScheme(entry.url)}
					</Link>
				) : null}
			</h3>
			<span className="whitespace-nowrap tabular-nums">
				{formatRange(entry.startDate, entry.endDate)}
			</span>
		</div>
		<Bullets items={entry.bullets} />
	</div>
);

const Education: React.FC<{ entries: EducationEntry[] }> = ({ entries }) => (
	<section>
		<SectionHeading>Education</SectionHeading>
		{entries.map((entry) => (
			<div key={entry.institution} className="mt-[0.6ex]">
				<div className="flex flex-wrap items-baseline justify-between gap-x-[0.95em]">
					<h3 className="font-bold">{entry.institution}</h3>
					<span className="whitespace-nowrap">{entry.location}</span>
				</div>
				<Bullets
					items={[
						<div
							key="degree"
							className="flex flex-wrap items-baseline justify-between gap-x-[0.95em]"
						>
							<span>
								{entry.degree}
								{entry.honors ? `. ${entry.honors}` : null}
								{entry.gpa ? `. GPA ${entry.gpa}` : null}
							</span>
							<span className="whitespace-nowrap tabular-nums">
								{formatYearRange(entry.startDate, entry.endDate)}
							</span>
						</div>,
					]}
				/>
			</div>
		))}
	</section>
);

const Skills: React.FC<{ groups: SkillGroup[] }> = ({ groups }) => (
	<section>
		<SectionHeading>Technical Skills</SectionHeading>
		{/* The LaTeX tabularx is 3 fixed columns; one column below `sm`. */}
		<div className="mt-[0.4ex] grid grid-cols-1 gap-x-[1.4em] gap-y-[0.6em] sm:grid-cols-3">
			{groups.map((group) => (
				<p key={group.label}>
					<span className="font-bold">{group.label}:</span>{" "}
					{group.items.join(", ")}
				</p>
			))}
		</div>
	</section>
);

const SectionHeading: React.FC<React.PropsWithChildren> = ({ children }) => (
	<h2 className={cn("mt-[1.6ex] pb-[0.3ex] text-[1.26em] font-bold", RULE)}>
		{children}
	</h2>
);

const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) =>
	items.length === 0 ? null : (
		<ul className="mt-[0.25ex] ml-[1.2em] list-disc space-y-[0.2ex] marker:text-current/60">
			{items.map((item, index) => (
				// Bullets are static prose in a fixed order; index is a stable key.
				// biome-ignore lint/suspicious/noArrayIndexKey: static content
				<li key={index} className="pl-[0.45em]">
					{item}
				</li>
			))}
		</ul>
	);

const Link: React.FC<
	React.PropsWithChildren<{ href: string; className?: string }>
> = ({ href, className, children }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className={cn("underline decoration-current/30 hover:decoration-current", className)}
	>
		{children}
	</a>
);

/** The `\quad` between contact fields. */
const Gap: React.FC = () => <span className="inline-block w-[1em]" />;
