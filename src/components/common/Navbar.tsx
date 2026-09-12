import { Switch } from "../ui/switch"
import { useStore } from "@nanostores/react"
import { themeStore, setTheme } from "@/lib/themeStore"
import { cn } from "@/lib/utils"
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

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/resume", label: "Résumé" },
]

interface NavbarProps {
    /**
     * Current route, from `Astro.url.pathname`. Passed in rather than read off
     * `window` — this island is `client:load`, so it also renders on the server.
     */
    pathname?: string
}

export const Navbar: React.FC<NavbarProps> = ({ pathname = "/" }) => {

    const theme = useStore(themeStore);

    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? "dark" : "light");
    }

    return (
        <div className="w-full h-12 bg-background border-b border-b-foreground/50 text-foreground flex justify-between items-center p-4 gap-x-2 overflow-hidden">
            <nav className="flex items-center gap-x-1 text-sm">
                {LINKS.map((link) => {
                    const active = pathname === link.href || pathname === `${link.href}/`
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "relative px-2 py-1 rounded-md transition-colors",
                                "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity",
                                active
                                    ? "text-foreground after:opacity-100"
                                    : "text-foreground/60 hover:text-foreground",
                            )}
                        >
                            {link.label}
                        </a>
                    )
                })}
            </nav>

            <div className="flex items-center gap-x-2">
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
        </div>
    )
}
