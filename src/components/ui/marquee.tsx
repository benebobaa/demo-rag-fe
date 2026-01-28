import * as React from "react"
import { cn } from "@/lib/utils"

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    items: React.ReactNode[]
    speed?: number
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
    ({ className, items, speed = 28, ...props }, ref) => {
        const doubled = [...items, ...items]

        return (
            <div
                ref={ref}
                className={cn("marquee overflow-hidden", className)}
                {...props}
            >
                <div
                    className="marquee-track flex w-max items-center gap-8 py-2"
                    style={{ animation: `marquee ${speed}s linear infinite` }}
                >
                    {doubled.map((item, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted"
                            aria-hidden={index >= items.length}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        )
    }
)
Marquee.displayName = "Marquee"

export { Marquee }
