import { useState } from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import toast from "react-hot-toast";
import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import SubjectForm from "./SubjectForm";
import SubjectTableRow from "./SubjectTableRow";
import UserStatusBadge from "../users/UserStatusBadge";

export default function SubjectTable({subjects, editSubject, removeSubject, canManage = true, }) 
{
    const [editing, setEditing] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = (subject) => {
        setConfirmAction({
            title: "Delete Subject",
            message: "Are you sure you want to delete this subject?",
            confirmText: "Delete",
            run: async () => {
                await removeSubject(subject.id);
                toast.success("Subject deleted successfully.");
            },
        });
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-cyan-100 bg-cyan-100/30 shadow-sm">
            <div className="divide-y md:hidden">
                {subjects.map((subject, index) => (
                    <div key={subject.id} className="p-4">
                        <div className="flex items-start justify-between gap-3 bg-cyan-300/70 text-white">
                            <div className="min-w-0">
                                <p className="truncate font-semibold">
                                    {subject.name}
                                </p>
                                <p className="text-sm ">
                                    {subject.code}
                                </p>
                            </div>
                            <UserStatusBadge active={subject.isActive} />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm ">
                            <p>
                                <span className="text-gray-400">SL:</span> {index + 1}
                            </p>
                            <p>
                                <span className="text-gray-400">Credit:</span> {subject.credit}
                            </p>
                        </div>
                        {subject.description && (
                            <p className="mt-2 line-clamp-2 text-sm">
                                {subject.description}
                            </p>
                        )}
                        <div className="mt-3 flex justify-end gap-2">
                            {canManage && (
                                <>
                                    <button
                                        onClick={() => setEditing(subject)}
                                        className="rounded-lg p-2 transition hover:bg-yellow-100"
                                        aria-label="Edit"
                                    >
                                        <RiEditLine size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subject)}
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
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                    <thead className="bg-cyan-500">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">
                                Code
                            </th>
                            <th className="px-4 py-3 text-left">
                                Name
                            </th>
                            <th className="px-4 py-3 text-center">
                                Credit
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
                        {subjects.map((subject, index) => (
                            <SubjectTableRow
                                key={subject.id}
                                index={index}
                                subject={subject}
                                editSubject={editSubject}
                                removeSubject={removeSubject}
                                canManage={canManage}
                            />
                        ))}

                    </tbody>

                </table>

            </div>

            {/* Shared edit modal (used by mobile cards) */}
            <CommonModal
                open={editing !== null}
                title="Edit Subject"
                onClose={() => setEditing(null)}
                formId="subjectForm"
            >

                <SubjectForm
                    subject={editing}
                    editSubject={editSubject}
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
