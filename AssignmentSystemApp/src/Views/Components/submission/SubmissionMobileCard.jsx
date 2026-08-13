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

export default function SubmissionMobileCard({
    submission,
    mode,
    gradeSubmission,
}) {

    const [open, setOpen] = useState(false);

    return (
        <div className="p-4">

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                    <p className="truncate font-semibold">
                        {submission.assignmentTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                        {submission.subjectName} - {submission.class}
                    </p>
                </div>

                <SubmissionStatusBadge status={submission.status} />

            </div>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">

                {mode !== "student" && (
                    <p>
                        <span className="text-gray-400">Student:</span> {submission.studentName}
                    </p>
                )}

                <p>
                    <span className="text-gray-400">Submitted:</span> {formatDate(submission.submittedAt)}
                </p>

                <p>
                    <span className="text-gray-400">Marks:</span> {submission.marks ?? "-"}
                </p>

            </div>

            {submission.feedback && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    <span className="text-gray-400">Feedback:</span> {submission.feedback}
                </p>
            )}

            {mode !== "student" && (
                <div className="mt-3 flex justify-end gap-2">

                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                        <RiCheckDoubleLine size={16} />
                        Review
                    </button>

                </div>
            )}

            {mode !== "student" && (
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
            )}

        </div>
    );
}
