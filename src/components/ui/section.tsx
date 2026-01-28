import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    size?: "default" | "tight"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, size = "default", ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    size === "default" ? "py-20 md:py-28" : "py-12 md:py-16",
                    className
                )}
                {...props}
            />
        )
    }
)
Section.displayName = "Section"

export { Section }
