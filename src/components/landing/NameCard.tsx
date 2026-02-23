import { Button } from "@/components/ui/button"
import { SiGithub, } from "@icons-pack/react-simple-icons"
import { Linkedin, LinkedinIcon, LucideLinkedin } from "lucide-react"

export const NameCard: React.FC = () => {
    return (
        <div className="rounded-2xl flex flex-col items-center justify-center text-foreground gap-y-6">
            <div className="flex flex-col -gap-y-1 w-full justify-center">
                <h1 className="text-5xl lg:text-6xl font-bold text-primary">
                    Gus
                </h1>
                <h2 className="text-2xl lg:text-3xl text-wrap font-medium">
                    Supratouch Suwatno
                </h2>
            </div>
            <div className="w-full flex flex-col gap-y-2 text-base lg:text-xl">
                <div className="flex gap-x-2">
                    <span className="text-foreground font-medium">Fulltime</span><span className="text-foreground/50">Software Engineer</span>
                </div>
                <div className="flex gap-x-2">
                    <span className="text-foreground font-medium">Parttime</span><span className="text-foreground/50">Random stuff coder</span>
                </div>
            </div>
            <div className="flex gap-x-4 items-center w-full">
                <a href="https://github.com/drowningtoast" target="_blank" rel="noopener noreferrer"><SiGithub className="size-6 lg:size-8" color="currentColor" /></a>
                <a href="www.linkedin.com/in/supratouch" target="_blank" rel="noopener noreferrer"><LucideLinkedin className="size-6 lg:size-8 text-transparent fill-foreground" /></a>
            </div>
        </div>
    )
}