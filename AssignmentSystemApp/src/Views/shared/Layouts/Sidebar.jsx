import SidebarHeader from "./SideBar/SidebarHeader";
import SidebarContent from "./SideBar/SidebarContent";

export default function Sidebar({ sidebarOpen, openSidebar, closeSidebar }) {
    return (
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-slate-800/90 p-1 text-white shadow-lg transition-transform duration-300 transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:transform-none md:transition-all ${sidebarOpen ? "md:w-64" : "md:w-16"}`}>
            <SidebarHeader sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
            <SidebarContent sidebarOpen={sidebarOpen} openSidebar={openSidebar} closeSidebar={closeSidebar} />
        </aside>
    );
}