import { NavLink } from "react-router-dom";
export default function SidebarItem({ item, sidebarOpen, onNavClick }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            onClick={onNavClick}
            className={({ isActive }) =>
                ` flex items-center gap-3 rounded-lg px-4 py-3
                transition-all duration-200
                ${
                    isActive
                        ? "bg-cyan-500 text-white"
                        : "text-white"
                }
                `
            }
        >
            <Icon size={20} />

            {sidebarOpen && <span>{item.title}</span>}
        </NavLink>
    );
}