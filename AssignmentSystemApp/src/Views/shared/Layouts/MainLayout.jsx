import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PageContainer from "./PageContainer";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(() =>
        typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
    );
    const [darkMode, setDarkMode] = useState(false);
    const toggleSidebar = () => { setSidebarOpen((prev) => !prev); };
    const openSidebar = () => { setSidebarOpen(true); };
    const closeSidebar = () => { setSidebarOpen(false); };
    return (
        <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${ darkMode ? "dark bg-slate-950 text-slate-100" : "bg-gray-100 text-gray-900" }`} >
            <Sidebar sidebarOpen={sidebarOpen} openSidebar={openSidebar} closeSidebar={closeSidebar} />
            {/* overlay for small screens when sidebar is open */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={closeSidebar} />
            )}
            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} setDarkMode={setDarkMode} />
                <PageContainer sidebarOpen={sidebarOpen}>
                    <Outlet />
                </PageContainer>
                <Footer />
            </div>
        </div>
    );
}