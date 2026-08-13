import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { navigation } from "../../../../config/navigation.config";
import { useAuth } from "../../../../context/AuthContext";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";

export default function SidebarContent({ sidebarOpen, openSidebar, closeSidebar }) {
    const location = useLocation();
    const { user } = useAuth();
    const [expandedGroup, setExpandedGroup] = useState(null);

    const role = user?.role?.toLowerCase();

    const visibleNavigation = useMemo(
        () =>
            navigation
                .filter(
                    (item) => !item.roles || item.roles.includes(role)
                )
                .map((item) => {
                    if (!item.children) return item;

                    const visibleChildren = item.children.filter(
                        (child) => !child.roles || child.roles.includes(role)
                    );

                    return { ...item, children: visibleChildren };
                })
                .filter(
                    (item) => !item.children || item.children.length > 0
                ),
        [role]
    );

    useEffect(() => {
        const activeGroup = visibleNavigation.find((item) =>
            item.children?.some((child) =>
                location.pathname === child.path ||
                location.pathname.startsWith(child.path + "/")
            )
        );
        setExpandedGroup(activeGroup?.id ?? null);
    }, [location.pathname, visibleNavigation]);

    const handleToggle = (itemId) => {
        if (!sidebarOpen) {
            openSidebar?.();
        }
        setExpandedGroup(expandedGroup === itemId ? null : itemId);
    };
    const handleNavClick = () => {
        if (window.matchMedia("(max-width: 767px)").matches) {
            closeSidebar?.();
        } else {
            openSidebar?.();
        }
    };
    return (
        <div className="flex-1 overflow-y-auto py-3">
            {visibleNavigation.map((item) =>
                item.children ?
                (
                    <SidebarGroup key={item.id} item={item} sidebarOpen={sidebarOpen} isExpanded={expandedGroup === item.id} onToggle={() => handleToggle(item.id)} onNavClick={handleNavClick} />
                ) : ( <SidebarItem key={item.id} item={item} sidebarOpen={sidebarOpen} onNavClick={handleNavClick} /> )
            )}
        </div>
    );
}
