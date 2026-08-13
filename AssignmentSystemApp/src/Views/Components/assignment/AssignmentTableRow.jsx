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

export default function AssignmentTableRow({
    index,
    assignment,
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

    const [open, setOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const isStudent = mode === "student";

    const submission = isStudent && submittedMap?.get(assignment.id);

    const isSubmitted = isStudent && Boolean(submission);

    const canUpdate = isStudent && isSubmitted && (
        submission.status === 1 &&
        assignment.status === STATUS_PUBLISHED &&
        !assignment.isExpired
    );

    const canSubmit = !isStudent || (
        assignment.status === STATUS_PUBLISHED &&
        !assignment.isExpired &&
        !isSubmitted
    );

    const handleDelete = () => {
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

    const handlePublish = () => {
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

    const handleClose = () => {
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

        <>
            <tr className="border-t">

            {/* SL */}
            <td className="px-4 py-3">
                {index + 1}
            </td>

            {/* Title */}
            <td className="px-4 py-3">
                <p className="font-medium">
                    {assignment.title}
                </p>
                {assignment.description && (
                    <p className="mt-1 line-clamp-2 max-w-xs text-xs text-gray-500">
                        {assignment.description}
                    </p>
                )}
            </td>

            {/* Class */}
            {!isStudent && (
                <td className="px-4 py-3">
                    {assignment.class || "-"}
                </td>
            )}

            {/* Subject */}
            <td className="px-4 py-3">
                {assignment.subjectName || "-"}
            </td>

            {/* Class (student mode) */}
            {isStudent && (
                <td className="px-4 py-3">
                    {assignment.class || "-"}
                </td>
            )}

            {/* Teacher */}
            <td className="px-4 py-3">
                {assignment.teacherName || "-"}
            </td>

            {/* Deadline */}
            <td className="px-4 py-3">
                {formatDate(assignment.deadline)}
            </td>

            {/* Maximum Marks */}
            <td className="px-4 py-3 text-center">
                {assignment.maximumMarks}
            </td>

            {/* Status */}
            <td className="px-4 py-3 text-center">

                <AssignmentStatusBadge
                    status={assignment.status}
                    isExpired={assignment.isExpired}
                />

            </td>

            {/* Action */}
            <td className="px-4 py-3">

                {isStudent ? (
                    <div className="flex justify-center">

                        {isSubmitted ? (
                            <>
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Submitted
                                </span>
                                {canUpdate && (
                                    <button
                                        onClick={() => setSubmitOpen(true)}
                                        className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
                                    >
                                        Update
                                    </button>
                                )}
                            </>
                        ) : canSubmit ? (
                            <button
                                onClick={() => setSubmitOpen(true)}
                                className="rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                            >
                                Submit
                            </button>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                Unavailable
                            </span>
                        )}

                    </div>
                ) : (
                    <div className="flex justify-center gap-2">

                        {canManage && (assignment.status === STATUS_DRAFT || assignment.status === STATUS_PUBLISHED) &&
                            !assignment.isExpired && (
                                <button
                                    onClick={() => setOpen(true)}
                                    className="rounded-lg p-2 transition hover:bg-yellow-100"
                                    title="Edit"
                                >
                                    <RiEditLine size={18} />
                                </button>
                            )}

                        {canManage && assignment.status === STATUS_DRAFT && (
                            <>
                                <button
                                    onClick={handlePublish}
                                    className="rounded-lg p-2 transition hover:bg-green-100"
                                    title="Publish"
                                >
                                    <RiSendPlaneLine size={18} />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="rounded-lg p-2 transition hover:bg-red-100"
                                    title="Delete"
                                >
                                    <RiDeleteBin6Line size={18} />
                                </button>
                            </>
                        )}

                        {canManage && assignment.status === STATUS_PUBLISHED && (
                            <button
                                onClick={handleClose}
                                className="rounded-lg p-2 transition hover:bg-amber-100"
                                title="Close"
                            >
                                <RiCloseCircleLine size={18} />
                            </button>
                        )}

                    </div>
                )}

                {/* Edit modal (manage mode) */}
                {!isStudent && (
                    <CommonModal
                        open={open}
                        title="Edit Assignment"
                        onClose={() => setOpen(false)}
                        formId="assignmentForm"
                    >

                        <AssignmentForm
                            assignment={assignment}
                            teacherClassSubjects={teacherClassSubjects}
                            editAssignment={editAssignment}
                            onClose={() => setOpen(false)}
                            onSuccess={() => setOpen(false)}
                        />

                    </CommonModal>
                )}

                {/* Submit modal (student mode) */}
                {isStudent && (
                    <CommonModal
                        open={submitOpen}
                        title={isSubmitted ? "Update Submission" : "Submit Assignment"}
                        onClose={() => setSubmitOpen(false)}
                        formId="submissionForm"
                    >

                        <SubmitForm
                            assignment={assignment}
                            submission={submission}
                            onClose={() => setSubmitOpen(false)}
                            onSuccess={onSubmitted}
                        />

                    </CommonModal>
                )}

            </td>

        </tr>

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
        </>
    );

}
