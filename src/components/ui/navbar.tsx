import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"

export interface NavbarLink {
    label: string
    href: string
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    brand?: React.ReactNode
    links?: NavbarLink[]
    actions?: React.ReactNode
    sticky?: boolean
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({ brand, links = [], actions, sticky = true, className, ...props }, ref) => {
        return (
            <header
                ref={ref}
                className={cn(
                    "w-full border-b border-border/70",
                    sticky && "sticky top-0 z-40 glass-panel",
                    className
                )}
                {...props}
            >
                <Container className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        {typeof brand === "string" ? (
                            <span className="text-sm font-semibold tracking-tight text-ink">
                                {brand}
                            </span>
                        ) : (
                            brand
                        )}
                    </div>
                    {links.length > 0 && (
                        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
                            {links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="transition-colors hover:text-ink"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    )}
                    <div className="flex items-center gap-2">{actions}</div>
                </Container>
            </header>
        )
    }
)
Navbar.displayName = "Navbar"

export { Navbar }
