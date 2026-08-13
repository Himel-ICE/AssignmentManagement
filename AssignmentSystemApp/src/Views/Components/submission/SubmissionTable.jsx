import SubmissionTableRow from "./SubmissionTableRow";
import SubmissionMobileCard from "./SubmissionMobileCard";

export default function SubmissionTable({
    submissions,
    mode,
    gradeSubmission,
}) {

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">

            {/* Mobile: stacked cards */}
            <div className="divide-y md:hidden">

                {submissions.map((submission) => (
                    <SubmissionMobileCard
                        key={submission.id}
                        submission={submission}
                        mode={mode}
                        gradeSubmission={gradeSubmission}
                    />
                ))}

            </div>

            {/* Desktop / tablet: table view */}
            <div className="hidden rounded-3xl overflow-x-auto md:block">
                <table className="min-w-full border border-cyan-100">
                    <thead className="bg-cyan-500">
                        <tr className="border-b border-cyan-200">
                            <th className="px-4 py-3 text-left">#</th>
                            {mode !== "student" && (
                                <th className="px-4 py-3 text-left">Student</th>
                            )}
                            <th className="px-4 py-3 text-left">Assignment</th>
                            {mode === "student" && (
                                <>
                                    <th className="px-4 py-3 text-left">Subject</th>
                                    <th className="px-4 py-3 text-left">Class</th>
                                </>
                            )}
                            <th className="px-4 py-3 text-left">Submitted At</th>
                            <th className="px-4 py-3 text-center">Marks</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            {mode === "student" && (
                                <th className="px-4 py-3 text-left">Feedback</th>
                            )}
                            {mode !== "student" && (
                                <th className="px-4 py-3 text-center">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <SubmissionTableRow
                                key={submission.id}
                                index={index}
                                submission={submission}
                                mode={mode}
                                gradeSubmission={gradeSubmission}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );

}
