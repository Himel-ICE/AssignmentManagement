import { useState } from "react";

import useAssignments from "../../../hooks/useAssignments";
import useTeacherClassSubjects from "../../../hooks/useTeacherClassSubjects";
import { useAuth } from "../../../context/AuthContext";

import AssignmentToolbar from "../../Components/assignment/AssignmentToolbar";
import AssignmentTable from "../../Components/assignment/AssignmentTable";
import LoadingState from "../../Components/assignment/LoadingState";
import EmptyState from "../../Components/assignment/EmptyState";
import StudentAssignments from "./StudentAssignments";

export default function Assignment() {

    const { user } = useAuth();

    const isStudent = user?.role?.toLowerCase() === "student";

    const isTeacher = user?.role?.toLowerCase() === "teacher";

    const canManage = isTeacher;

    const {
        assignments,
        loading,
        error,
        loadAssignments,
        addAssignment,
        editAssignment,
        removeAssignment,
        publish,
        close,
    } = useAssignments();

    const {
        assignments: teacherClassSubjects,
        loading: loadingSubjects,
    } = useTeacherClassSubjects({ mine: isTeacher });

    const [search, setSearch] = useState("");

    const activeTeacherClassSubjects = teacherClassSubjects.filter((tcs) => tcs.isActive);

    const teacherClassSubjectIds = new Set(
        isTeacher
            ? teacherClassSubjects.filter((tcs) => tcs.teacherId === user.id).map((tcs) => tcs.id)
            : teacherClassSubjects.map((tcs) => tcs.id)
    );

    const availableTeacherClassSubjects = isTeacher
        ? activeTeacherClassSubjects.filter((tcs) => tcs.teacherId === user.id)
        : activeTeacherClassSubjects;

    const visibleAssignments = isTeacher
        ? assignments.filter((a) => teacherClassSubjectIds.has(a.teacherClassSubjectId))
        : assignments;

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

    if (isStudent) {
        return <StudentAssignments />;
    }

    if (loading || loadingSubjects) {
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

            <AssignmentToolbar
                total={filteredAssignments.length}
                search={search}
                onSearch={setSearch}
                addAssignment={addAssignment}
                loadAssignments={loadAssignments}
                teacherClassSubjects={availableTeacherClassSubjects}
                canManage={canManage}
            />

            </div>

            <div className="mx-auto w-full max-w-7xl">

                {
                    filteredAssignments.length === 0
                        ? (
                            <EmptyState />
                        )
                        : (
                            <AssignmentTable
                                assignments={filteredAssignments}
                                teacherClassSubjects={availableTeacherClassSubjects}
                                editAssignment={editAssignment}
                                removeAssignment={removeAssignment}
                                publish={publish}
                                close={close}
                                canManage={canManage}
                            />
                        )
                }

            </div>

        </div>
    );

}
