import { useCallback, useEffect, useState } from "react";

import {
    getMySubmissions,
    getAllSubmissions,
    submitAnswer,
    updateSubmission,
    reviewSubmission,
    deleteSubmission,
} from "../Services/submissionService";

export default function useSubmissions({ mine = false } = {}) {

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = mine
                ? await getMySubmissions()
                : await getAllSubmissions();
            setSubmissions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [mine]);

    const addSubmission = async (payload) => {
        await submitAnswer(payload);
        await loadSubmissions();
    };

    const editSubmission = async (id, payload) => {
        await updateSubmission(id, payload);
        await loadSubmissions();
    };

    const gradeSubmission = async (id, payload) => {
        await reviewSubmission(id, payload);
        await loadSubmissions();
    };

    const removeSubmission = async (id) => {
        await deleteSubmission(id);
        await loadSubmissions();
    };

    useEffect(() => {
        loadSubmissions();
    }, [loadSubmissions]);

    return {
        submissions,
        loading,
        error,
        loadSubmissions,
        addSubmission,
        editSubmission,
        gradeSubmission,
        removeSubmission,
    };
}
