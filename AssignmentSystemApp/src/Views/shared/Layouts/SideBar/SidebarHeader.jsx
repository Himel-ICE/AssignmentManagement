export default function SidebarHeader({ sidebarOpen, }) 
{
    return (
        <div className="flex h-14 items-center justify-center">
            {
                sidebarOpen
                    ? <img src="/logo.png" alt="Logo" className="h-8" />
                    : <img src="/logo-mini.png" alt="Logo" className="h-8" />
            }
        </div>
    );
}