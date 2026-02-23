import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Skills } from "@/constants/skills";
import { useMemo } from "react";

export function SkillsCarousel() {
	const randomSkills = useMemo(() => {
		return Skills.sort(() => Math.random() - 0.5);
	}, []);
	return <LogoCarousel logos={randomSkills} />;
}
