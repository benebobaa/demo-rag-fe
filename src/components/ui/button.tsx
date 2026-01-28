import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-accent text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md",
                destructive: "bg-red-500 text-white shadow-sm hover:-translate-y-0.5 hover:bg-red-600",
                outline: "border border-border bg-transparent text-ink hover:bg-surface hover:shadow-sm",
                secondary: "border border-border bg-surface text-ink hover:bg-accent-soft hover:shadow-sm",
                ghost: "bg-transparent text-ink hover:bg-accent-soft",
                link: "text-accent underline-offset-4 hover:text-accent/80 hover:underline",
            },
            size: {
                default: "h-10 px-5",
                sm: "h-8 px-3",
                lg: "h-12 px-6",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
