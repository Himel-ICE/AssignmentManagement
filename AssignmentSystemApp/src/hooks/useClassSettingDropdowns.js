import { useEffect, useState } from "react";
import {
    getTeachersDropdown,
    getClassesDropdown,
    getSubjectsDropdown,
} from "../Services/dropdownService";

export default function useClassSettingDropdowns() {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAll = async () => {
            try {
                setLoading(true);
                setError(null);
                const [teacherData, classData, subjectData] = await Promise.all([
                    getTeachersDropdown(),
                    getClassesDropdown(),
                    getSubjectsDropdown(),
                ]);
                setTeachers(teacherData);
                setClasses(classData);
                setSubjects(subjectData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    return {
        teachers,
        classes,
        subjects,
        loading,
        error,
    };
}
