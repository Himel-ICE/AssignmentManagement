import { useCallback, useEffect, useState } from "react";

import {
    getAllAcademicClasses,
    createAcademicClass,
    updateAcademicClass,
    deleteAcademicClass,
} from "../Services/academicClassService";

export default function useAcademicClasses() {

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadClasses = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getAllAcademicClasses();

            setClasses(data);

        }
        catch (err) {

            setError(err.message);

        }
        finally {

            setLoading(false);

        }

    }, []);

    const addClass = async (payload) => {

        await createAcademicClass(payload);

        await loadClasses();

    };

    const editClass = async (id, payload) => {

        await updateAcademicClass(id, payload);

        await loadClasses();

    };

    const removeClass = async (id) => {

        await deleteAcademicClass(id);

        await loadClasses();

    };

    useEffect(() => {

        loadClasses();

    }, [loadClasses]);

    return {

        classes,
        loading,
        error,

        loadClasses,
        addClass,
        editClass,
        removeClass,

    };

}
