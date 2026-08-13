import { useState } from "react";
import {
    RiCloseCircleLine,
    RiDeleteBin6Line,
    RiEditLine,
    RiSendPlaneLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import AssignmentForm from "./AssignmentForm";
import AssignmentTableRow from "./AssignmentTableRow";
import AssignmentStatusBadge from "./AssignmentStatusBadge";
import SubmitForm from "../submission/SubmitForm";

const STATUS_DRAFT = 1;
const STATUS_PUBLISHED = 2;

const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

export default function AssignmentTable({
    assignments,
    teacherClassSubjects,
    editAssignment,
    removeAssignment,
    publish,
    close,
    mode = "manage",
    canManage = true,
    submittedMap,
    onSubmitted,
}) {

    const [editing, setEditing] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const isStudent = mode === "student";

    const handleDelete = (assignment) => {
        setConfirmAction({
            title: "Delete Assignment",
            message: "Are you sure you want to delete this assignment?",
            confirmText: "Delete",
            danger: true,
            run: async () => {
                await removeAssignment(assignment.id);
                toast.success("Assignment deleted successfully.");
            },
        });
    };

    const handlePublish = (assignment) => {
        setConfirmAction({
            title: "Publish Assignment",
            message: "Are you sure you want to publish this assignment?",
            confirmText: "Publish",
            danger: false,
            run: async () => {
                await publish(assignment.id);
                toast.success("Assignment published successfully.");
            },
        });
    };

    const handleClose = (assignment) => {
        setConfirmAction({
            title: "Close Assignment",
            message: "Are you sure you want to close this assignment?",
            confirmText: "Close",
            danger: false,
            run: async () => {
                await close(assignment.id);
                toast.success("Assignment closed successfully.");
            },
        });
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">

            {/* Mobile: stacked cards */}
            <div className="divide-y md:hidden">

                {assignments.map((assignment, index) => {

                    const submission = isStudent && submittedMap?.get(assignment.id);
                    const isSubmitted = isStudent && Boolean(submission);
                    const canSubmit = isStudent && (
                        assignment.status === STATUS_PUBLISHED &&
                        !assignment.isExpired &&
                        !isSubmitted
                    );
                    const canUpdate = isStudent && isSubmitted && (
                        submission.status === 1 &&
                        assignment.status === STATUS_PUBLISHED &&
                        !assignment.isExpired
                    );

                    return (
                        <div key={assignment.id} className="p-4">

                            <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {assignment.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {assignment.subjectName} - {assignment.class}
                                    </p>
                                </div>

                                <AssignmentStatusBadge
                                    status={assignment.status}
                                    isExpired={assignment.isExpired}
                                />

                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">

                                <p>
                                    <span className="text-gray-400">SL:</span> {index + 1}
                                </p>

                                <p>
                                    <span className="text-gray-400">Teacher:</span> {assignment.teacherName}
                                </p>

                                <p>
                                    <span className="text-gray-400">Deadline:</span> {formatDate(assignment.deadline)}
                                </p>

                                <p>
                                    <span className="text-gray-400">Marks:</span> {assignment.maximumMarks}
                                </p>

                            </div>

                            {assignment.description && (
                                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                    {assignment.description}
                                </p>
                            )}

                            <div className="mt-3 flex justify-end gap-2">

                                {isStudent ? (
                                    isSubmitted ? (
                                        <>
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                Submitted
                                            </span>
                                            {canUpdate && (
                                                <button
                                                    onClick={() => setEditing(assignment)}
                                                    className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </>
                                    ) : canSubmit ? (
                                        <button
                                            onClick={() => setEditing(assignment)}
                                            className="rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                            Unavailable
                                        </span>
                                    )
                                ) : (
                                    <>
                                        {canManage && (assignment.status === STATUS_DRAFT || assignment.status === STATUS_PUBLISHED) &&
                                            !assignment.isExpired && (
                                                <button
                                                    onClick={() => setEditing(assignment)}
                                                    className="rounded-lg p-2 transition hover:bg-yellow-100"
                                                    aria-label="Edit"
                                                >
                                                    <RiEditLine size={18} />
                                                </button>
                                            )}

                                        {canManage && assignment.status === STATUS_DRAFT && (
                                            <>
                                                <button
                                                    onClick={() => handlePublish(assignment)}
                                                    className="rounded-lg p-2 transition hover:bg-green-100"
                                                    aria-label="Publish"
                                                >
                                                    <RiSendPlaneLine size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(assignment)}
                                                    className="rounded-lg p-2 transition hover:bg-red-100"
                                                    aria-label="Delete"
                                                >
                                                    <RiDeleteBin6Line size={18} />
                                                </button>
                                            </>
                                        )}

                                        {canManage && assignment.status === STATUS_PUBLISHED && (
                                            <button
                                                onClick={() => handleClose(assignment)}
                                                className="rounded-lg p-2 transition hover:bg-amber-100"
                                                aria-label="Close"
                                            >
                                                <RiCloseCircleLine size={18} />
                                            </button>
                                        )}
                                    </>
                                )}

                            </div>

                        </div>
                    );
                })}

            </div>

            {/* Desktop / tablet: table view */}
            <div className="hidden rounded-3xl overflow-x-auto md:block">
                <table className="min-w-full border border-cyan-100">
                    <thead className="bg-cyan-500">
                        <tr className="border-b border-cyan-200">
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Title</th>
                            {!isStudent && (
                                <th className="px-4 py-3 text-left">Class</th>
                            )}
                            <th className="px-4 py-3 text-left">Subject</th>
                            {isStudent && (
                                <th className="px-4 py-3 text-left">Class</th>
                            )}
                            <th className="px-4 py-3 text-left">Teacher</th>
                            <th className="px-4 py-3 text-left">Deadline</th>
                            <th className="px-4 py-3 text-center">Marks</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment, index) => (
                            <AssignmentTableRow
                                key={assignment.id}
                                index={index}
                                assignment={assignment}
                                teacherClassSubjects={teacherClassSubjects}
                                editAssignment={editAssignment}
                                removeAssignment={removeAssignment}
                                publish={publish}
                                close={close}
                                mode={mode}
                                canManage={canManage}
                                submittedMap={submittedMap}
                                onSubmitted={onSubmitted}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Shared edit/submit modal (used by mobile cards) */}
            {isStudent ? (
                <CommonModal
                    open={editing !== null}
                    title={editing && submittedMap?.get(editing.id) ? "Update Submission" : "Submit Assignment"}
                    onClose={() => setEditing(null)}
                    formId="submissionForm"
                >
                    <SubmitForm
                        assignment={editing}
                        submission={editing ? submittedMap?.get(editing.id) : null}
                        onClose={() => setEditing(null)}
                        onSuccess={onSubmitted}
                    />
                </CommonModal>
            ) : (
                <CommonModal
                    open={editing !== null}
                    title="Edit Assignment"
                    onClose={() => setEditing(null)}
                    formId="assignmentForm"
                >
                    <AssignmentForm
                        assignment={editing}
                        teacherClassSubjects={teacherClassSubjects}
                        editAssignment={editAssignment}
                        onClose={() => setEditing(null)}
                        onSuccess={() => setEditing(null)}
                    />
                </CommonModal>
            )}

            <ConfirmDialog
                open={confirmAction !== null}
                title={confirmAction?.title}
                message={confirmAction?.message}
                confirmText={confirmAction?.confirmText}
                danger={confirmAction?.danger}
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
