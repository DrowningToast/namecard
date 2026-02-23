import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

export const Description: React.FC<{ value: string | undefined }> = ({ value }) => {

    const [isClamped, setIsClamped] = useState(true)
    const [isOverflowing, setIsOverflowing] = useState(true)
    const textRef = useRef<HTMLParagraphElement>(null)

    const label = isClamped ? "Show more" : "Show less"

    useEffect(() => {
        if (textRef.current) {
            setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight)
        }
    }, [value])

    if (!value) {
        return null
    }

    return (
        <div
            onClick={() => isOverflowing && setIsClamped(!isClamped)}
            className="text-sm text-foreground/50">
            <p ref={textRef} className={cn({ "line-clamp-2": isClamped })}>
                {value}
            </p>
            {isOverflowing && (
                <span className="text-primary/80 hover:text-primary transition-colors cursor-pointer">
                    {label}
                </span>
            )}
        </div>
    )
}
