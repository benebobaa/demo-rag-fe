import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"

export interface FooterColumn {
    title: string
    links: { label: string; href: string }[]
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    brand?: React.ReactNode
    columns?: FooterColumn[]
    note?: string
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ brand, columns = [], note, className, ...props }, ref) => {
        return (
            <footer
                ref={ref}
                className={cn("border-t border-border/70 bg-surface", className)}
                {...props}
            >
                <Container className="flex flex-col gap-10 py-12">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-sm">
                            {typeof brand === "string" ? (
                                <div className="text-base font-semibold text-ink">{brand}</div>
                            ) : (
                                brand
                            )}
                            {note && (
                                <p className="mt-3 text-sm text-muted">{note}</p>
                            )}
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                            {columns.map((column) => (
                                <div key={column.title} className="space-y-3">
                                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                                        {column.title}
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm text-muted">
                                        {column.links.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className="transition-colors hover:text-ink"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
                        <span>(c) {new Date().getFullYear()} GraphAgent. All rights reserved.</span>
                        <span>Designed for human-friendly intelligence.</span>
                    </div>
                </Container>
            </footer>
        )
    }
)
Footer.displayName = "Footer"

export { Footer }
