import { BsMoonStars } from "react-icons/bs";
import { IoSunnyOutline } from "react-icons/io5";

export default function ThemeToggle({ darkMode, setDarkMode, }) 
{
    return (
        <button onClick={() => setDarkMode(!darkMode)} className="rounded-lg p-2 transition hover:bg-sky-100/10" >
            {darkMode ? (
                <IoSunnyOutline size={20} />
            ) : (
                <BsMoonStars size={20} />
            )}
        </button>
    );
}