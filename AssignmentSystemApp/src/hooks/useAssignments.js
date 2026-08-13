import { useCallback, useEffect, useState } from "react";

import {
    getAllAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    publishAssignment,
    closeAssignment,
} from "../Services/assignmentService";

export default function useAssignments() {

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAssignments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllAssignments();
            setAssignments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addAssignment = async (payload) => {
        await createAssignment(payload);
        await loadAssignments();
    };

    const editAssignment = async (id, payload) => {
        await updateAssignment(id, payload);
        await loadAssignments();
    };

    const removeAssignment = async (id) => {
        await deleteAssignment(id);
        await loadAssignments();
    };

    const publish = async (id) => {
        await publishAssignment(id);
        await loadAssignments();
    };

    const close = async (id) => {
        await closeAssignment(id);
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
        publish,
        close,
    };
}
