import { useState } from "react";

import useTeacherClassSubjects from "../../../hooks/useTeacherClassSubjects";

import ClassSettingToolbar from "../../Components/classSetting/ClassSettingToolbar";
import ClassSettingTable from "../../Components/classSetting/ClassSettingTable";
import LoadingState from "../../Components/classSetting/LoadingState";
import EmptyState from "../../Components/classSetting/EmptyState";

export default function ClassSetting() {

    const {
        assignments,
        loading,
        error,
        loadAssignments,
        addAssignment,
        editAssignment,
        removeAssignment,
    } = useTeacherClassSubjects();

    const [search, setSearch] = useState("");

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                {error}
            </div>
        );
    }

    const filteredAssignments = assignments.filter((x) =>
        x.teacherName?.toLowerCase().includes(search.toLowerCase()) ||
        x.academicClassName?.toLowerCase().includes(search.toLowerCase()) ||
        x.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
        x.subjectCode?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">

            <div className="mx-auto w-full max-w-5xl">

                <ClassSettingToolbar
                    total={filteredAssignments.length}
                    search={search}
                    onSearch={setSearch}
                    loadAssignments={loadAssignments}
                    addAssignment={addAssignment}
                />

            </div>

            <div className="mx-auto w-full max-w-5xl">

                {
                    filteredAssignments.length === 0
                        ? (
                            <EmptyState />
                        )
                        : (
                            <ClassSettingTable
                                assignments={filteredAssignments}
                                editAssignment={editAssignment}
                                removeAssignment={removeAssignment}
                            />
                        )
                }

            </div>

        </div>
    );
}
