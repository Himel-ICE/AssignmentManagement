import { NavLink } from "react-router-dom";
import { RiArrowDownSLine } from "react-icons/ri";

export default function SidebarGroup({ item, sidebarOpen, isExpanded, onToggle, onNavClick, }) 
{
    const Icon = item.icon;

    return (
        <div className="mb-1">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 hover:bg-white/30" >
                <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {sidebarOpen && (
                        <span>{item.title}</span>
                    )}
                </div>
                {sidebarOpen && (
                    <RiArrowDownSLine
                        size={18}
                        className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                )}
            </button>
            {/* Child */}
            {sidebarOpen && isExpanded && (
                <div className="ml-6 mt-1 flex flex-col gap-1 text-white">
                    {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                            <NavLink key={child.id} to={child.path} onClick={onNavClick}
                                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200
                                    ${
                                        isActive
                                            ? "bg-cyan-500 text-white"
                                            : "text-white hover:bg-white/10"
                                    }`
                                }
                            >
                                {ChildIcon && <ChildIcon size={18} />}
                                <span>{child.title}</span>
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
}