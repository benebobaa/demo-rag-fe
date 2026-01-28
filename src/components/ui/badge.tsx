import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "border-border bg-accent-soft text-ink",
                secondary: "border-border bg-surface text-muted",
                destructive: "border-red-200 bg-red-500/10 text-red-600",
                outline: "border-border bg-transparent text-ink",
                success: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
                warning: "border-amber-200 bg-amber-500/10 text-amber-700",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
