import { useState } from "react";

import useAcademicClasses from "../../../hooks/useAcademicClasses";
import { useAuth } from "../../../context/AuthContext";

import ClassToolbar from "../../Components/class/ClassToolbar";
import ClassTable from "../../Components/class/ClassTable";
import LoadingState from "../../Components/class/LoadingState";
import EmptyState from "../../Components/class/EmptyState";

export default function Classes() {

    const { user } = useAuth();

    const canManage = user?.role?.toLowerCase() !== "student";

    const {
        classes,
        loading,
        error,
        loadClasses,
        addClass,
        editClass,
        removeClass,
    } = useAcademicClasses();

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

    const filteredClasses = classes.filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase()) ||
        x.department.toLowerCase().includes(search.toLowerCase()) ||
        x.semester.toLowerCase().includes(search.toLowerCase()) ||
        x.section.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">

            <div className="mx-auto w-full max-w-5xl">

                <ClassToolbar
                    total={filteredClasses.length}
                    search={search}
                    onSearch={setSearch}
                    loadClasses={loadClasses}
                    addClass={addClass}
                    canManage={canManage}
                />

            </div>

            <div className="mx-auto w-full max-w-5xl">

                {
                    filteredClasses.length === 0
                        ? (
                            <EmptyState />
                        )
                        : (
                            <ClassTable
                                classes={filteredClasses}
                                editClass={editClass}
                                removeClass={removeClass}
                                canManage={canManage}
                            />
                        )
                }

            </div>

        </div>
    );

}
