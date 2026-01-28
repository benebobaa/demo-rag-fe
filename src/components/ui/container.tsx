import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "default" | "wide"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "mx-auto w-full px-6 md:px-8",
                    size === "default" && "max-w-[1200px]",
                    size === "wide" && "max-w-[1320px]",
                    className
                )}
                {...props}
            />
        )
    }
)
Container.displayName = "Container"

export { Container }
