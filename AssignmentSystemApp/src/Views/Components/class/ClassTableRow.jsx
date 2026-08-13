import { useState } from "react";
import {
    RiDeleteBin6Line,
    RiEditLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import ClassForm from "./ClassForm";
import UserStatusBadge from "../users/UserStatusBadge";

export default function ClassTableRow({
    index,
    classItem,
    editClass,
    removeClass,
    canManage = true,
}) {

    const [open, setOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = () => {
        setConfirmAction({
            title: "Delete Class",
            message: "Are you sure you want to delete this class?",
            confirmText: "Delete",
            run: async () => {
                await removeClass(classItem.id);
                toast.success("Class deleted successfully.");
            },
        });
    };

    return (

        <>
            <tr className="border-t">

                {/* SL */}
                <td className="px-4 py-3">
                    {index + 1}
                </td>

                {/* Name */}
                <td className="px-4 py-3 font-medium">
                    {classItem.name}
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                    {classItem.department}
                </td>

                {/* Semester */}
                <td className="px-4 py-3">
                    {classItem.semester}
                </td>

                {/* Section */}
                <td className="px-4 py-3 text-center">
                    {classItem.section}
                </td>

                {/* Description */}
                <td className="px-4 py-3">
                    {classItem.description}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">

                    <UserStatusBadge
                        active={classItem.isActive}
                    />

                </td>

                {/* Action */}
                {canManage && (
                    <td className="px-4 py-3">

                        <div className="flex justify-center gap-2">

                            <button
                                onClick={() => setOpen(true)}
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
                            title="Edit Class"
                            onClose={() => setOpen(false)}
                            formId="classForm"
                        >

                            <ClassForm
                                classItem={classItem}
                                editClass={editClass}
                                onClose={() => setOpen(false)}
                                onSuccess={() => setOpen(false)}
                            />

                        </CommonModal>

                    </td>
                )}

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
