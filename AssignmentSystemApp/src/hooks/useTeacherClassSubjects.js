import { useCallback, useEffect, useState } from "react";

import {
    getAllTeacherClassSubjects,
    getMyTeacherClassSubjects,
    createTeacherClassSubject,
    updateTeacherClassSubject,
    deleteTeacherClassSubject,
} from "../Services/teacherClassSubjectService";

export default function useTeacherClassSubjects({ mine = false } = {}) {

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAssignments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = mine
                ? await getMyTeacherClassSubjects()
                : await getAllTeacherClassSubjects();
            setAssignments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [mine]);

    const addAssignment = async (payload) => {
        await createTeacherClassSubject(payload);
        await loadAssignments();
    };

    const editAssignment = async (id, payload) => {
        await updateTeacherClassSubject(id, payload);
        await loadAssignments();
    };

    const removeAssignment = async (id) => {
        await deleteTeacherClassSubject(id);
        await loadAssignments();
    };

    useEffect(() => {
        loadAssignments();
    }, [loadAssignments]);

    return {
        assignments,
        loading,
        error,
        loadAssignments,
        addAssignment,
        editAssignment,
        removeAssignment,
    };
}
