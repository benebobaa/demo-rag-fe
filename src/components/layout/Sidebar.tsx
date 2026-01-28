import { NavLink } from "react-router-dom";
import { LayoutGrid, Database, PlayCircle, Settings, BoxSelect, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const navItems = [
        { icon: BoxSelect, label: "Studio", to: "/studio" },
        { icon: Network, label: "Explore", to: "/explore" },
        { icon: Database, label: "Knowledge", to: "/knowledge" },
        { icon: PlayCircle, label: "Playground", to: "/playground" },
    ];

    return (
        <div className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface/90 backdrop-blur">
            <div className="p-6">
                <div className="flex items-center gap-3 text-base font-semibold text-ink">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                        <LayoutGrid className="h-4 w-4" />
                    </div>
                    <span>GraphAgent</span>
                </div>
                <p className="mt-2 text-xs text-muted">Premium graph orchestration</p>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                                isActive
                                    ? "bg-accent-soft text-ink shadow-sm"
                                    : "text-muted hover:bg-accent-soft/60 hover:text-ink"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-border px-4 py-4">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-accent-soft/60 hover:text-ink">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
};
