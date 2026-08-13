import Breadcrumb from "./Breadcrumb";
export default function PageContainer({ children, sidebarOpen,}) 
{
    // Add left margin on md+ to account for the sidebar width (collapsed vs expanded).
    const mdMarginClass = sidebarOpen ? "" : "";
    return (
        <main className={`min-w-0 flex-1 overflow-auto transition-all ${mdMarginClass} p-4 md:p-6`}>
            <Breadcrumb />
            {children}
        </main>
    );
}