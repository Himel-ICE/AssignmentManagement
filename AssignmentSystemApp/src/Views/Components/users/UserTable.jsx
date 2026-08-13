import { useState } from "react";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";

import UserTableRow from "./UserTableRow";
import UserForm from "./UserForm";
import UserStatusBadge from "./UserStatusBadge";
import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import { getUserById } from "../../../Services/userService";

export default function UserTable({ users, editUser, removeUser }) {

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleEdit = async (user) => {

        try {

            const data = await getUserById(user.id);

            setSelectedUser(data);

            setOpen(true);

        } catch (err) {

            toast.error(err.message);

        }

    };

    const handleDelete = (user) => {

        setConfirmAction({
            title: "Delete User",
            message: "Are you sure you want to delete this user?",
            confirmText: "Delete",
            run: async () => {
                await removeUser(user.id);
                toast.success("User deleted.");
            },
        });

    };

    return (
        <div className="overflow-hidden rounded-3xl border border-cyan-200/50 bg-cyan-200/10 shadow-sm">
            {/* Mobile: stacked cards */}
            <div className="divide-y md:hidden">

                {users.map((user) => (

                    <div key={user.id} className="p-4">

                        <div className="flex items-start justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
                                    {user.fullName?.charAt(0)}
                                </div>

                                <div className="min-w-0">

                                    <p className="truncate font-medium">
                                        {user.fullName}
                                    </p>

                                    <p className="truncate text-xs opacity-70">
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                            <UserStatusBadge active={user.isActive} />

                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm opacity-80">

                            <p>
                                <span className="opacity-60">ID:</span> {user.id}
                            </p>

                            <p>
                                <span className="opacity-60">Role:</span> {user.role ?? "-"}
                            </p>

                            {user.phoneNumber && (
                                <p>
                                    <span className="opacity-60">Phone:</span> {user.phoneNumber}
                                </p>
                            )}

                        </div>

                        <div className="mt-3 flex justify-end gap-2">

                            <button
                                onClick={() => handleEdit(user)}
                                className="rounded-lg p-2 transition hover:bg-yellow-100"
                                aria-label="Edit"
                            >
                                <RiEditLine size={18} />
                            </button>

                            <button
                                onClick={() => handleDelete(user)}
                                className="rounded-lg p-2 transition hover:bg-red-100"
                                aria-label="Delete"
                            >
                                <RiDeleteBin6Line size={18} />
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* Desktop/tablet: table view */}
            <div className="hidden overflow-x-auto md:block">

                <table className="w-full table-auto">

                    <thead className="bg-cyan-500/50 dark:text-white ">

                        <tr>

                            <th className="w-16 px-3 py-2 md:px-3 md:py-3 text-left">#</th>

                            <th className="w-52 px-3 py-2 md:px-3 md:py-3 text-left">Full Name</th>

                            <th className="hidden md:table-cell w-64 px-3 py-2 md:px-3 md:py-3 text-left">Email</th>

                            <th className="hidden lg:table-cell w-40 px-3 py-2 md:px-3 md:py-3 text-left">Phone</th>

                            <th className="hidden lg:table-cell w-28 px-3 py-2 md:px-3 md:py-3 text-left">Role</th>

                            <th className="w-24 px-3 py-2 md:px-3 md:py-3 text-center">Status</th>

                            <th className="w-32 px-3 py-2 md:px-3 md:py-3 text-center">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user, index) => (

                            <UserTableRow
                                key={user.id}
                                user={user}
                                index={index}
                                editUser={editUser}
                                removeUser={removeUser}
                            />
                        ))}

                    </tbody>

                </table>

            </div>

            {/* Shared edit modal (used by mobile cards) */}
            <CommonModal
                open={open}
                title="Edit User"
                onClose={() => setOpen(false)}
                formId="userForm"
            >

                <UserForm
                    user={selectedUser}
                    editUser={editUser}
                    onClose={() => setOpen(false)}
                />

            </CommonModal>

            <ConfirmDialog
                open={confirmAction !== null}
                title={confirmAction?.title}
                message={confirmAction?.message}
                confirmText={confirmAction?.confirmText}
                onCancel={() => setConfirmAction(null)}
                onConfirm={async () => {
                    try {
                        await confirmAction?.run();
                    } catch (error) {
                        toast.error(error.message);
                    }
                }}
            />

        </div>
    );
}
