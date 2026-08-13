import { useState } from "react";

import useSubjects from "../../../hooks/useSubjects";
import { useAuth } from "../../../context/AuthContext";

import SubjectToolbar from "../../Components/subject/SubjectToolbar";
import SubjectTable from "../../Components/subject/SubjectTable";
import LoadingState from "../../Components/subject/LoadingState";
import EmptyState from "../../Components/subject/EmptyState";

export default function Subjects() {
    const { user } = useAuth();

    const canManage = user?.role?.toLowerCase() !== "student";

    const { subjects, loading, error, loadSubjects, editSubject, removeSubject, } = useSubjects();
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
    const filteredSubjects = subjects.filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase()) ||
        x.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 mt-10">
            <div className="mx-auto w-full max-w-5xl">
                <SubjectToolbar total={filteredSubjects.length} search={search} onSearch={setSearch} loadSubjects={loadSubjects} canManage={canManage} />
            </div>
            <div className="mx-auto w-full max-w-5xl">
                {
                    filteredSubjects.length === 0
                        ? (
                            <EmptyState />
                        )
                        : (
                            <SubjectTable
                                subjects={filteredSubjects}
                                editSubject={editSubject}
                                removeSubject={removeSubject}
                                loadSubjects={loadSubjects}
                                canManage={canManage}
                            />
                        )
                }

            </div>

        </div>
    );

}