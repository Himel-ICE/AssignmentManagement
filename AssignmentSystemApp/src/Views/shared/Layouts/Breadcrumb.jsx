import { useLocation, Link } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { navigation } from "../../../config/navigation.config";

export default function Breadcrumb() {
    const location = useLocation();
    const pathname = location.pathname;

    // Parse path and get breadcrumb items
    const getBreadcrumbs = () => {
        const breadcrumbs = [ { title: "Home", path: "/", icon: RiHome2Line } ];

        if (pathname === "/") { return breadcrumbs; }

        // Find the item from navigation config
        let currentTitle = pathname.replace("/", "").toUpperCase();
        
        navigation.forEach((item) => {
            if (item.path === pathname) {
                currentTitle = item.title;
            }
            if (item.children) {
                const child = item.children.find((c) => c.path === pathname);
                if (child) {
                    breadcrumbs.push({ title: item.title, path: "#" });
                    currentTitle = child.title;
                }
            }
        });

        if (currentTitle !== "Home") {
            breadcrumbs.push({ title: currentTitle, path: pathname, isActive: true });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-xs text-cyan-500 border-gray-300/30 border-b sm:px-4 sm:text-sm">
            {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index === 0 ? (
                        <Link to={item.path} >
                            <RiHome2Line size={18} />
                        </Link>
                    ) : item.isActive ? ( <span>
                            {item.title}
                        </span>
                    ) : (
                        <Link to={item.path} >
                            {item.title}
                        </Link>
                    )}
                    {index < breadcrumbs.length - 1 && ( <span >/</span> )}
                </div>
            ))}
        </div>
    );
}