import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useState } from "react";
import UserForm from "./UserForm";
import CommonModal from "../../Components/Common/CommonModal";

export default function UserToolbar({total, search, onSearch, loadUsers,}) 
{
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col mt-10 gap-4 rounded-3xl border border-cyan-200/50 bg-cyan-200/10 p-5 shadow-sm  lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-2xl font-bold"> User Management </h1>
                <p className="mt-1 text-sm opacity-70"> Total Users : {total} </p>
            </div>
            {/* Right */}
            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search user..."
                        className="w-full sm:w-72 rounded-lg border border-cyan-200/50 bg-cyan-200/10 py-2 pl-10 pr-4 outline-none"
                    />
                </div>
                {/* Add */}
                <button
                    onClick={() => setOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2 font-medium text-white transition hover:bg-cyan-700" >
                    <RiAddLine size={18} />
                    Add User
                </button>
            </div>
            <CommonModal
                open={open}
                title="Add User"
                onClose={() => setOpen(false)}
                formId="userForm"
            >
                <UserForm onClose={() => setOpen(false)} onSuccess={loadUsers}/>
            </CommonModal>
        </div>
    );
}