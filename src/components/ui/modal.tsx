import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    description?: string
    children?: React.ReactNode
    className?: string
}

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    className,
}: ModalProps) {
    React.useEffect(() => {
        if (!open) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div
                className="absolute inset-0 bg-ink/30"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative w-full max-w-xl rounded-lg border border-border bg-surface p-6 shadow-lg",
                    className
                )}
            >
                {(title || description) && (
                    <div className="mb-4">
                        {title && (
                            <h3 className="text-lg font-semibold text-ink">{title}</h3>
                        )}
                        {description && (
                            <p className="mt-1 text-sm text-muted">{description}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}
