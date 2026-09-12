import { findSection } from "@/data/resume";
import { toSectionViewModels } from "@/lib/resume-adapter";

export const Activities = toSectionViewModels(
	findSection("Leadership & Activities"),
);
