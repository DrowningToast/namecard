import { findSection } from "@/data/resume";
import { toSectionViewModels } from "@/lib/resume-adapter";

export const WorkExperience = toSectionViewModels(findSection("Experiences"));
