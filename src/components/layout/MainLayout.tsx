import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-bg text-ink">
            <Sidebar />
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-bg">
                <Outlet />
            </main>
        </div>
    );
};
