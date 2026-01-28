import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabItem {
    id: string
    label: string
    content: React.ReactNode
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    tabs: TabItem[]
    defaultValue?: string
    onValueChange?: (value: string) => void
}

export function Tabs({ tabs, defaultValue, onValueChange, className, ...props }: TabsProps) {
    const [active, setActive] = React.useState(defaultValue || tabs[0]?.id)

    React.useEffect(() => {
        if (defaultValue) setActive(defaultValue)
    }, [defaultValue])

    const handleChange = (value: string) => {
        setActive(value)
        onValueChange?.(value)
    }

    const activeTab = tabs.find((tab) => tab.id === active)

    return (
        <div className={cn("space-y-4", className)} {...props}>
            <div className="flex flex-wrap gap-2 rounded-full border border-border bg-surface p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleChange(tab.id)}
                        className={cn(
                            "rounded-full px-4 py-1.5 text-sm font-medium transition",
                            active === tab.id
                                ? "bg-accent text-white shadow-sm"
                                : "text-muted hover:text-ink"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{activeTab?.content}</div>
        </div>
    )
}
