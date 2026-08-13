import { useState } from "react";

import useAssignments from "../../../hooks/useAssignments";
import useSubmissions from "../../../hooks/useSubmissions";

import AssignmentToolbar from "../../Components/assignment/AssignmentToolbar";
import AssignmentTable from "../../Components/assignment/AssignmentTable";
import LoadingState from "../../Components/assignment/LoadingState";
import EmptyState from "../../Components/assignment/EmptyState";

export default function StudentAssignments() {

    const {
        assignments,
        loading,
        error,
        loadAssignments,
    } = useAssignments();

    const {
        submissions,
        loading: loadingSubmissions,
        loadSubmissions,
    } = useSubmissions({ mine: true });

    const [search, setSearch] = useState("");

    const submittedMap = new Map(
        submissions.map((s) => [s.assignmentId, s])
    );

    const visibleAssignments = assignments.filter(
        (a) => a.status === 2 || a.status === 3
    );

    const filteredAssignments = visibleAssignments.filter((x) => {
        const q = search.toLowerCase();
        return (
            x.title.toLowerCase().includes(q) ||
            x.description.toLowerCase().includes(q) ||
            x.teacherName.toLowerCase().includes(q) ||
            x.class.toLowerCase().includes(q) ||
            x.subjectName.toLowerCase().includes(q)
        );
    });

    if (loading || loadingSubmissions) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                {error}
            </div>
        );
    }

    const handleSubmitted = () => {
        loadAssignments();
        loadSubmissions();
    };

    return (
        <div className="space-y-5">

            <div className="mx-auto w-full max-w-7xl">

                <AssignmentToolbar
                    total={filteredAssignments.length}
                    search={search}
                    onSearch={setSearch}
                    loadAssignments={loadAssignments}
                    mode="student"
                />

            </div>

            <div className="mx-auto w-full max-w-7xl">

                {
                    filteredAssignments.length === 0
                        ? (
                            <EmptyState student />
                        )
                        : (
                            <AssignmentTable
                                assignments={filteredAssignments}
                                mode="student"
                                submittedMap={submittedMap}
                                onSubmitted={handleSubmitted}
                            />
                        )
                }

            </div>

        </div>
    );

}
