import { findSection } from "@/data/resume";
import { toSectionViewModels } from "@/lib/resume-adapter";

export const Projects = toSectionViewModels(findSection("Projects"));
