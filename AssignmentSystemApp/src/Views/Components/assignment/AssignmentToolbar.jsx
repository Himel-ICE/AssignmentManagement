import { useState } from "react";
import { RiAddLine, RiSearchLine } from "react-icons/ri";

import CommonModal from "../Common/CommonModal";
import AssignmentForm from "./AssignmentForm";

export default function AssignmentToolbar({
    total,
    search,
    onSearch,
    loadAssignments,
    addAssignment,
    teacherClassSubjects,
    mode = "manage",
    canManage = true,
}) {

    const [open, setOpen] = useState(false);

    const isStudent = mode === "student";

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-cyan-200 bg-cyan-100/30 mt-10 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>
                <h1 className="text-2xl font-bold">
                    {isStudent ? "My Assignments" : "Assignment Management"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Total Assignments : {total}
                </p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative">

                    <RiSearchLine
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search Assignment..."
                        className="w-full rounded-lg border border-cyan-300 py-2 pl-10 pr-4 outline-none sm:w-72"
                    />

                </div>

                {canManage && !isStudent && (
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white transition hover:bg-cyan-700"
                    >
                        <RiAddLine size={18} />
                        Add Assignment
                    </button>
                )}

            </div>

            {!isStudent && (
                <CommonModal
                    open={open}
                    title="Add Assignment"
                    onClose={() => setOpen(false)}
                    formId="assignmentForm"
                >

                    <AssignmentForm
                        teacherClassSubjects={teacherClassSubjects}
                        onClose={() => setOpen(false)}
                        onSuccess={loadAssignments}
                        addAssignment={addAssignment}
                    />

                </CommonModal>
            )}

        </div>
    );

}
