import * as React from "react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/useInView"

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
    delay?: number
}

const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
    ({ className, delay = 0, style, ...props }, ref) => {
        const { ref: inViewRef, inView } = useInView<HTMLDivElement>()

        const setRefs = (node: HTMLDivElement | null) => {
            inViewRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        }

        return (
            <div
                ref={setRefs}
                className={cn(
                    "transform transition-all duration-700 ease-out",
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    className
                )}
                style={{ transitionDelay: `${delay}ms`, ...style }}
                {...props}
            />
        )
    }
)
Reveal.displayName = "Reveal"

export { Reveal }
