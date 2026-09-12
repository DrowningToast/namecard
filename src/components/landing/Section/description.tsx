import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface DescriptionProps {
    value?: string
    /** Rendered as a list. Takes precedence over `value` when present. */
    bullets?: string[]
}

/** Collapsed height, in line boxes. Scales with the responsive font size. */
const COLLAPSED_LINES = 3

export const Description: React.FC<DescriptionProps> = ({ value, bullets }) => {

    const [isClamped, setIsClamped] = useState(true)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const hasBullets = Boolean(bullets?.length)
    const label = isClamped ? "Show more" : "Show less"

    useEffect(() => {
        // Only measurable while clamped — expanded, scrollHeight === clientHeight.
        // Skipping the expanded pass also keeps the toggle visible so it can be
        // collapsed again.
        if (!isClamped) return
        const el = contentRef.current
        if (!el) return
        setIsOverflowing(el.scrollHeight > el.clientHeight)
    }, [value, bullets, isClamped])

    if (!hasBullets && !value) {
        return null
    }

    return (
        <div className="text-sm lg:text-base text-foreground/70">
            <div
                ref={contentRef}
                className={cn(isClamped && "overflow-hidden")}
                style={isClamped ? { maxHeight: `${COLLAPSED_LINES}lh` } : undefined}
            >
                {hasBullets ? (
                    <ul className="list-disc ps-5 space-y-1 marker:text-foreground/40">
                        {bullets?.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                        ))}
                    </ul>
                ) : (
                    <p>{value}</p>
                )}
            </div>
            {isOverflowing && (
                <button
                    type="button"
                    // The toggle is the affordance — clicking the text itself does
                    // nothing, so selecting and copying a bullet works normally.
                    onClick={() => setIsClamped(!isClamped)}
                    aria-expanded={!isClamped}
                    className="mt-1 text-primary/80 hover:text-primary transition-colors cursor-pointer text-sm lg:text-base"
                >
                    {label}
                </button>
            )}
        </div>
    )
}
