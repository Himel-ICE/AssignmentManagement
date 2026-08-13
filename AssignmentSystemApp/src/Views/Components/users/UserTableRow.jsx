import { RiEditLine, RiDeleteBin6Line, RiEyeLine, } from "react-icons/ri";
import { useState } from "react";
import { getUserById } from "../../../Services/userService";
import toast from "react-hot-toast";
import UserForm from "./UserForm";
import UserStatusBadge from "./UserStatusBadge";
import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";

export default function UserTableRow({ index, user, editUser, removeUser, onView,}) 
{
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleEdit = async () => {

        try {

            const data = await getUserById(user.id);

            setSelectedUser(data);

            setOpen(true);

        } catch (err) {

            toast.error(err.message);

        }

    };
    const handleDelete = () => {
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
        <>
        <tr className="border-b border-cyan-200/20 transition-colors hover:bg-cyan-200/50">

            {/* SL */}
            <td className="px-3 py-2 md:px-5 md:py-4">
                {index + 1}
            </td>

            {/* Name */}
            <td className="px-3 py-2 md:px-5 md:py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
                        {user.fullName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">
                            {user.fullName}
                        </p>
                        <p className="text-xs opacity-70">
                            ID : {user.id}
                        </p>
                    </div>
                </div>
            </td>

            {/* Email */}
            <td className="hidden md:table-cell px-3 py-2 md:px-5 md:py-4">
                {user.email}
            </td>

            {/* Phone */}
            <td className="hidden lg:table-cell px-3 py-2 md:px-5 md:py-4">
                {user.phoneNumber}
            </td>

            {/* Role */}
            <td className="hidden lg:table-cell px-3 py-2 md:px-5 md:py-4">
                {user.role ?? "-"}
            </td>

            {/* Status */}
            <td className="px-3 py-2 md:px-5 md:py-4 text-center">
                <UserStatusBadge
                    active={user.isActive}
                />
            </td>

            {/* Action */}
            <td className="px-3 py-2 md:px-5 md:py-4">

                <div className="flex justify-center gap-2">

                    <button
                        onClick={() => onView?.(user)}
                        className="rounded-lg p-2 transition hover:bg-cyan-100"
                    >
                        <RiEyeLine size={18} />
                    </button>

                    <button
                        onClick={handleEdit}
                        className="rounded-lg p-2 transition hover:bg-yellow-100"
                    >
                        <RiEditLine size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg p-2 transition hover:bg-red-100"
                    >
                        <RiDeleteBin6Line size={18} />
                    </button>
                </div>

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

            </td>
        </tr>

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
        </>
    );
}