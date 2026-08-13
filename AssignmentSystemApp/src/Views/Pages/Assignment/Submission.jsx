import { useState } from "react";

import useSubmissions from "../../../hooks/useSubmissions";
import useAssignments from "../../../hooks/useAssignments";
import { useAuth } from "../../../context/AuthContext";

import SubmissionToolbar from "../../Components/submission/SubmissionToolbar";
import SubmissionTable from "../../Components/submission/SubmissionTable";
import LoadingState from "../../Components/submission/LoadingState";
import EmptyState from "../../Components/submission/EmptyState";

const STATUS_PUBLISHED = 2;

export default function Submission() {

    const { user } = useAuth();

    const isStudent = user?.role?.toLowerCase() === "student";

    const {
        submissions,
        loading,
        error,
        loadSubmissions,
        gradeSubmission,
    } = useSubmissions({ mine: isStudent });

    const {
        assignments,
        loading: loadingAssignments,
    } = useAssignments();

    const [search, setSearch] = useState("");

    const submittedAssignmentIds = new Set(
        submissions.map((s) => s.assignmentId)
    );

    const availableAssignments = assignments.filter(
        (a) => a.status === STATUS_PUBLISHED && !a.isExpired && !submittedAssignmentIds.has(a.id)
    );

    const filteredSubmissions = submissions.filter((x) => {
        const q = search.toLowerCase();
        return (
            x.assignmentTitle?.toLowerCase().includes(q) ||
            x.subjectName?.toLowerCase().includes(q) ||
            x.class?.toLowerCase().includes(q) ||
            x.studentName?.toLowerCase().includes(q) ||
            x.feedback?.toLowerCase().includes(q)
        );
    });

    if (loading || loadingAssignments) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-5">

            <div className="mx-auto w-full max-w-7xl">

                <SubmissionToolbar
                    total={filteredSubmissions.length}
                    search={search}
                    onSearch={setSearch}
                    mode={isStudent ? "student" : "teacher"}
                    availableAssignments={availableAssignments}
                    onSubmit={loadSubmissions}
                />

            </div>

            <div className="mx-auto w-full max-w-7xl">

                {
                    filteredSubmissions.length === 0
                        ? (
                            <EmptyState mine={isStudent} />
                        )
                        : (
                            <SubmissionTable
                                submissions={filteredSubmissions}
                                mode={isStudent ? "student" : "teacher"}
                                gradeSubmission={gradeSubmission}
                            />
                        )
                }

            </div>

        </div>
    );

}
