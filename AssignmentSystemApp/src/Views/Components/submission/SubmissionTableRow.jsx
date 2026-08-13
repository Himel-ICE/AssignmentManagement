import { useState } from "react";
import { RiCheckDoubleLine } from "react-icons/ri";

import CommonModal from "../Common/CommonModal";
import ReviewForm from "./ReviewForm";
import SubmissionStatusBadge from "./SubmissionStatusBadge";

const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

export default function SubmissionTableRow({
    index,
    submission,
    mode,
    gradeSubmission,
}) {

    const [open, setOpen] = useState(false);

    const isStudent = mode === "student";

    return (

        <tr className="border-t">

            {/* SL */}
            <td className="px-4 py-3">
                {index + 1}
            </td>

            {/* Student */}
            {!isStudent && (
                <td className="px-4 py-3 font-medium">
                    {submission.studentName || "-"}
                </td>
            )}

            {/* Assignment */}
            <td className="px-4 py-3">
                <p className="font-medium">
                    {submission.assignmentTitle || "-"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {submission.subjectName} - {submission.class}
                </p>
            </td>

            {/* Subject */}
            {isStudent && (
                <td className="px-4 py-3">
                    {submission.subjectName || "-"}
                </td>
            )}

            {/* Class */}
            {isStudent && (
                <td className="px-4 py-3">
                    {submission.class || "-"}
                </td>
            )}

            {/* Submitted At */}
            <td className="px-4 py-3">
                {formatDate(submission.submittedAt)}
            </td>

            {/* Marks */}
            <td className="px-4 py-3 text-center">
                {submission.marks ?? "-"}
            </td>

            {/* Status */}
            <td className="px-4 py-3 text-center">

                <SubmissionStatusBadge status={submission.status} />

            </td>

            {/* Feedback */}
            {isStudent && (
                <td className="px-4 py-3">
                    {submission.feedback || "-"}
                </td>
            )}

            {/* Action */}
            {!isStudent && (
                <td className="px-4 py-3 text-center">

                    <div className="flex justify-center gap-2">

                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-lg p-2 transition hover:bg-green-100"
                            title="Review"
                        >
                            <RiCheckDoubleLine size={18} />
                        </button>

                    </div>

                    <CommonModal
                        open={open}
                        title="Review Submission"
                        onClose={() => setOpen(false)}
                        formId="reviewForm"
                    >

                        <ReviewForm
                            submission={submission}
                            gradeSubmission={gradeSubmission}
                            onClose={() => setOpen(false)}
                            onSuccess={() => setOpen(false)}
                        />

                    </CommonModal>

                </td>
            )}

        </tr>
    );

}
