import { useState } from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import ClassForm from "./ClassForm";
import ClassTableRow from "./ClassTableRow";
import UserStatusBadge from "../users/UserStatusBadge";

export default function ClassTable({
    classes,
    editClass,
    removeClass,
    canManage = true,
}) {
    const [editing, setEditing] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = (classItem) => {
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
        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">

            {/* Mobile: stacked cards */}
            <div className="divide-y md:hidden">

                {classes.map((classItem, index) => (

                    <div key={classItem.id} className="p-4">

                        <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                                <p className="truncate font-semibold">
                                    {classItem.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {classItem.department}
                                </p>

                            </div>

                            <UserStatusBadge active={classItem.isActive} />

                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">

                            <p>
                                <span className="text-gray-400">SL:</span> {index + 1}
                            </p>

                            <p>
                                <span className="text-gray-400">Semester:</span> {classItem.semester}
                            </p>

                            <p>
                                <span className="text-gray-400">Section:</span> {classItem.section}
                            </p>

                        </div>

                        {classItem.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                {classItem.description}
                            </p>
                        )}

                        <div className="mt-3 flex justify-end gap-2">

                            {canManage && (
                                <>
                                    <button
                                        onClick={() => setEditing(classItem)}
                                        className="rounded-lg p-2 transition hover:bg-yellow-100"
                                        aria-label="Edit"
                                    >
                                        <RiEditLine size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(classItem)}
                                        className="rounded-lg p-2 transition hover:bg-red-100"
                                        aria-label="Delete"
                                    >
                                        <RiDeleteBin6Line size={18} />
                                    </button>
                                </>
                            )}

                        </div>

                    </div>

                ))}

            </div>

            {/* Desktop / tablet: table view */}
            <div className="hidden rounded-3xl overflow-x-auto md:block">
                <table className="min-w-full  border border-cyan-100">
                    <thead className="bg-cyan-500">
                        <tr className="border-b border-cyan-200">
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left">
                                Department
                            </th>
                            <th className="px-4 py-3 text-left">
                                Semester
                            </th>
                            <th className="px-4 py-3 text-center">
                                Section
                            </th>
                            <th className="px-4 py-3 text-left">
                                Description
                            </th>
                            <th className="px-4 py-3 text-center">
                                Status
                            </th>
                            {canManage && (
                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classItem, index) => (
                            <ClassTableRow
                                key={classItem.id}
                                index={index}
                                classItem={classItem}
                                editClass={editClass}
                                removeClass={removeClass}
                                canManage={canManage}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Shared edit modal (used by mobile cards) */}
            <CommonModal
                open={editing !== null}
                title="Edit Class"
                onClose={() => setEditing(null)}
                formId="classForm"
            >
                <ClassForm
                    classItem={editing}
                    editClass={editClass}
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
