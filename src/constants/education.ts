import { Resume } from "@/data/resume";
import { educationToSectionViewModels } from "@/lib/resume-adapter";

export const Education = educationToSectionViewModels(Resume.education);
