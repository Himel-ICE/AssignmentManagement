import { useState } from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import ClassSettingForm from "./ClassSettingForm";
import UserStatusBadge from "../users/UserStatusBadge";

export default function ClassSettingTableRow({
    index,
    assignment,
    editAssignment,
    removeAssignment,
}) {

    const [open, setOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = () => {
        setConfirmAction({
            title: "Delete Assignment",
            message: "Are you sure you want to delete this assignment?",
            confirmText: "Delete",
            run: async () => {
                await removeAssignment(assignment.id);
                toast.success("Assignment deleted successfully.");
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

            {/* Teacher */}
            <td className="px-3 py-2 md:px-5 md:py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
                        {assignment.teacherName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium">
                            {assignment.teacherName}
                        </p>
                        <p className="text-xs opacity-70">
                            ID : {assignment.id}
                        </p>
                    </div>
                </div>
            </td>

            {/* Class */}
            <td className="hidden md:table-cell px-3 py-2 md:px-5 md:py-4">
                {assignment.academicClassName}
            </td>

            {/* Subject */}
            <td className="hidden lg:table-cell px-3 py-2 md:px-5 md:py-4">
                {assignment.subjectName}
                <span className="block text-xs opacity-70">
                    {assignment.subjectCode}
                </span>
            </td>

            {/* Status */}
            <td className="px-3 py-2 md:px-5 md:py-4 text-center">
                <UserStatusBadge
                    active={assignment.isActive}
                />
            </td>

            {/* Action */}
            <td className="px-3 py-2 md:px-5 md:py-4">

                <div className="flex justify-center gap-2">

                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg p-2 transition hover:bg-yellow-100"
                        aria-label="Edit"
                    >
                        <RiEditLine size={18} />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="rounded-lg p-2 transition hover:bg-red-100"
                        aria-label="Delete"
                    >
                        <RiDeleteBin6Line size={18} />
                    </button>

                </div>

                <CommonModal
                    open={open}
                    title="Edit Assignment"
                    onClose={() => setOpen(false)}
                    formId="classSettingForm"
                >
                    <ClassSettingForm
                        assignment={assignment}
                        editAssignment={editAssignment}
                        onClose={() => setOpen(false)}
                        onSuccess={() => setOpen(false)}
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
