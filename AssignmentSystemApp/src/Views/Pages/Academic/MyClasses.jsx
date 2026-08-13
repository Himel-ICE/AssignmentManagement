import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

import useTeacherClassSubjects from "../../../hooks/useTeacherClassSubjects";
import UserStatusBadge from "../../Components/users/UserStatusBadge";

export default function MyClasses() {

    const {
        assignments,
        loading,
        error,
    } = useTeacherClassSubjects({ mine: true });

    const [search, setSearch] = useState("");

    const filteredAssignments = assignments.filter((x) => {
        const q = search.toLowerCase();
        return (
            x.academicClassName?.toLowerCase().includes(q) ||
            x.subjectName?.toLowerCase().includes(q) ||
            x.subjectCode?.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
                <p className="text-lg font-medium text-gray-500">
                    Loading assigned classes...
                </p>
            </div>
        );
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

                <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-cyan-200 bg-cyan-100/30 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            My Classes
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Total Assigned : {filteredAssignments.length}
                        </p>
                    </div>

                    <div className="relative">

                        <RiSearchLine
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Class / Subject..."
                            className="w-full rounded-lg border border-cyan-300 py-2 pl-10 pr-4 outline-none sm:w-72"
                        />

                    </div>

                </div>

            </div>

            <div className="mx-auto w-full max-w-7xl">

                {
                    filteredAssignments.length === 0
                        ? (
                            <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
                                <h2 className="text-xl font-semibold">
                                    No Classes Assigned
                                </h2>
                                <p className="mt-2 text-gray-500">
                                    You are not assigned to any class yet.
                                </p>
                            </div>
                        )
                        : (
                            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">

                                {/* Mobile: stacked cards */}
                                <div className="divide-y md:hidden">

                                    {filteredAssignments.map((assignment, index) => (
                                        <div key={assignment.id} className="p-4">

                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {assignment.academicClassName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {assignment.subjectName}
                                                    </p>
                                                </div>
                                                <UserStatusBadge active={assignment.isActive} />
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                                                <p>
                                                    <span className="text-gray-400">SL:</span> {index + 1}
                                                </p>
                                                <p>
                                                    <span className="text-gray-400">Subject Code:</span> {assignment.subjectCode}
                                                </p>
                                            </div>

                                        </div>
                                    ))}

                                </div>

                                {/* Desktop / tablet: table view */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="min-w-full">
                                        <thead className="bg-cyan-500">
                                            <tr className="border-b border-cyan-200">
                                                <th className="px-4 py-3 text-left">#</th>
                                                <th className="px-4 py-3 text-left">Class</th>
                                                <th className="px-4 py-3 text-left">Subject</th>
                                                <th className="px-4 py-3 text-left">Subject Code</th>
                                                <th className="px-4 py-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAssignments.map((assignment, index) => (
                                                <tr key={assignment.id} className="border-t">
                                                    <td className="px-4 py-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {assignment.academicClassName || "-"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {assignment.subjectName || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {assignment.subjectCode || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <UserStatusBadge active={assignment.isActive} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        )
                }

            </div>

        </div>
    );

}
