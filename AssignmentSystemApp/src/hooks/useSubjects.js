import { useCallback, useEffect, useState } from "react";

import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} from "../Services/subjectService";

export default function useSubjects() {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadSubjects = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getAllSubjects();

            setSubjects(data);

        }
        catch (err) {

            setError(err.message);

        }
        finally {

            setLoading(false);

        }

    }, []);

    const addSubject = async (payload) => {

        await createSubject(payload);

        await loadSubjects();

    };

    const editSubject = async (id, payload) => {

        await updateSubject(id, payload);

        await loadSubjects();

    };

    const removeSubject = async (id) => {

        await deleteSubject(id);

        await loadSubjects();

    };

    useEffect(() => {

        loadSubjects();

    }, [loadSubjects]);

    return {

        subjects,
        loading,
        error,

        loadSubjects,
        addSubject,
        editSubject,
        removeSubject,

    };

}