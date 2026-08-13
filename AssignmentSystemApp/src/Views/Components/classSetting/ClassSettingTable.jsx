import { useState } from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import ClassSettingForm from "./ClassSettingForm";
import ClassSettingTableRow from "./ClassSettingTableRow";
import UserStatusBadge from "../users/UserStatusBadge";

export default function ClassSettingTable({
    assignments,
    editAssignment,
    removeAssignment,
}) {

    const [editing, setEditing] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = (assignment) => {
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
        <div className="overflow-hidden rounded-3xl border border-cyan-200/50 bg-cyan-200/10 shadow-sm">

            {/* Mobile: stacked cards */}
            <div className="divide-y md:hidden">

                {assignments.map((assignment, index) => (
                    <div key={assignment.id} className="p-4">

                        <div className="flex items-start justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-semibold text-white">
                                    {assignment.teacherName?.charAt(0)}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {assignment.teacherName}
                                    </p>
                                    <p className="truncate text-xs opacity-70">
                                        {assignment.academicClassName} - {assignment.subjectName}
                                    </p>
                                </div>

                            </div>

                            <UserStatusBadge active={assignment.isActive} />

                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm opacity-80">
                            <p>
                                <span className="opacity-60">SL:</span> {index + 1}
                            </p>
                            <p>
                                <span className="opacity-60">Subject Code:</span> {assignment.subjectCode}
                            </p>
                        </div>

                        <div className="mt-3 flex justify-end gap-2">

                            <button
                                onClick={() => setEditing(assignment)}
                                className="rounded-lg p-2 transition hover:bg-yellow-100"
                                aria-label="Edit"
                            >
                                <RiEditLine size={18} />
                            </button>

                            <button
                                onClick={() => handleDelete(assignment)}
                                className="rounded-lg p-2 transition hover:bg-red-100"
                                aria-label="Delete"
                            >
                                <RiDeleteBin6Line size={18} />
                            </button>

                        </div>
                    </div>
                ))}

            </div>

            {/* Desktop / tablet: table view */}
            <div className="hidden overflow-x-auto md:block">

                <table className="w-full table-auto">

                    <thead className="bg-cyan-500/50 dark:text-white">
                        <tr>
                            <th className="w-16 px-3 py-2 md:px-3 md:py-3 text-left">#</th>
                            <th className="w-52 px-3 py-2 md:px-3 md:py-3 text-left">Teacher</th>
                            <th className="hidden md:table-cell w-40 px-3 py-2 md:px-3 md:py-3 text-left">Class</th>
                            <th className="hidden lg:table-cell w-56 px-3 py-2 md:px-3 md:py-3 text-left">Subject</th>
                            <th className="w-24 px-3 py-2 md:px-3 md:py-3 text-center">Status</th>
                            <th className="w-32 px-3 py-2 md:px-3 md:py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {assignments.map((assignment, index) => (
                            <ClassSettingTableRow
                                key={assignment.id}
                                index={index}
                                assignment={assignment}
                                editAssignment={editAssignment}
                                removeAssignment={removeAssignment}
                            />
                        ))}
                    </tbody>

                </table>

            </div>

            {/* Shared edit modal (used by mobile cards) */}
            <CommonModal
                open={editing !== null}
                title="Edit Assignment"
                onClose={() => setEditing(null)}
                formId="classSettingForm"
            >
                <ClassSettingForm
                    assignment={editing}
                    editAssignment={editAssignment}
                    onClose={() => setEditing(null)}
                    onSuccess={() => setEditing(null)}
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
