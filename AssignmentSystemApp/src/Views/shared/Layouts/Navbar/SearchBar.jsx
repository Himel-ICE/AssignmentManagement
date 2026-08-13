import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex-1 max-w-md flex items-center justify-center">
            {/* Desktop search */}
            <div className="hidden md:flex w-full">
                <div className="relative w-full">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/50" />
                    <input type="text" placeholder="Search..." className="w-full rounded-xl border border-cyan-300/50 px-10 py-2 outline-none text-cyan-300" />
                </div>
            </div>

            {/* Mobile: icon toggles a small input */}
            <div className="md:hidden flex items-center gap-2">
                <button aria-label="Open search" onClick={() => setOpen((s) => !s)} className="p-2 rounded-md hover:bg-gray-700/40">
                    <RiSearchLine size={20} />
                </button>
                {open && (
                    <div className="absolute left-4 right-4 top-16 z-50">
                        <div className="rounded-lg bg-white p-2 shadow-md dark:bg-slate-800">
                            <div className="relative">
                                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input autoFocus type="text" placeholder="Search..." className="w-full rounded-lg border px-10 py-2 outline-none bg-white dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}