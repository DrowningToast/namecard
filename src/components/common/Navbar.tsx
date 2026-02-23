import { Switch } from "../ui/switch"
import { useStore } from "@nanostores/react"
import { themeStore, setTheme } from "@/lib/themeStore"
import { MoonIcon, SunIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type { PropsWithChildren } from "react"

const Icon: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="size-4 grid place-items-center"
        >
            {children}
        </motion.div>
    )
}

export const Navbar: React.FC = () => {

    const theme = useStore(themeStore);

    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? "dark" : "light");
    }

    return (
        <div className="w-full h-12 bg-background border-b border-b-foreground/50 text-foreground flex justify-end items-center p-4 gap-x-2 overflow-hidden">
            <div className="size-4 flex flex-nowrap flex-col items-center justify-center gap-y-2">
                <AnimatePresence mode="wait" initial={false}>
                    {
                        theme === "light" ?
                            <Icon key="light">
                                <SunIcon className="w-4 h-4" />
                            </Icon> :
                            <Icon key="dark">
                                <MoonIcon className="w-4 h-4" />
                            </Icon>
                    }
                </AnimatePresence>
            </div>

            <Switch checked={theme === "dark"} onCheckedChange={handleThemeChange} />
        </div>
    )
}