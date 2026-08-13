import { useEffect, useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext"

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-sky-100/10"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-700 font-bold text-lime-400">
                    {user?.firstName?.charAt(0)}
                </div>

                <div className="hidden text-left md:block">
                    <p className="font-semibold"> {user?.firstName} {user?.lastName} </p>
                    <p className="text-sm"> {user?.role} </p>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm text-gray-700 shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                        <p className="font-semibold"> {user?.firstName} {user?.lastName} </p>
                        <p className="truncate text-xs text-gray-500"> {user?.email} </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-red-50 hover:text-red-600"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
