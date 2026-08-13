import { RiMenuFold2Line, RiMenuUnfold2Line } from "react-icons/ri";
import SearchBar from "./Navbar/SearchBar";
import ThemeToggle from "./Navbar/ThemeToggle";
import ProfileDropdown from "./Navbar/ProfileDropdown";

export default function Navbar({ sidebarOpen, toggleSidebar, darkMode, setDarkMode, }) {

    return (
        <header className="flex h-16 items-center justify-between gap-2 bg-gray-800/90 px-3 text-gray-100 backdrop-blur-md transition-colors sm:gap-4 sm:px-5" >
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <button onClick={toggleSidebar} aria-label="Toggle sidebar" className="p-2 rounded-md hover:bg-gray-700/60">
                    {sidebarOpen ? <RiMenuFold2Line size={24} /> : <RiMenuUnfold2Line size={24} /> }
                </button>
            </div>
            <SearchBar />
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <ProfileDropdown />
            </div>
        </header>
    );
}