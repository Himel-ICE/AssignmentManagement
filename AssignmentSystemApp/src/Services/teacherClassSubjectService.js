import {
    getAllTeacherClassSubjectsApi,
    getMyTeacherClassSubjectsApi,
    getTeacherClassSubjectByIdApi,
    createTeacherClassSubjectApi,
    updateTeacherClassSubjectApi,
    deleteTeacherClassSubjectApi,
} from "../api/teacherClassSubjectApi";

export const getAllTeacherClassSubjects = async () => {
    try {
        const response = await getAllTeacherClassSubjectsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load teacher class subjects."
        );
    }
};

export const getMyTeacherClassSubjects = async () => {
    try {
        const response = await getMyTeacherClassSubjectsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load your assigned classes."
        );
    }
};

export const getTeacherClassSubjectById = async (id) => {
    try {
        const response = await getTeacherClassSubjectByIdApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load teacher class subject."
        );
    }
};

export const createTeacherClassSubject = async (payload) => {
    try {
        const response = await createTeacherClassSubjectApi(payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to create teacher class subject."
        );
    }
};

export const updateTeacherClassSubject = async (id, payload) => {
    try {
        const response = await updateTeacherClassSubjectApi(id, payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to update teacher class subject."
        );
    }
};

export const deleteTeacherClassSubject = async (id) => {
    try {
        const response = await deleteTeacherClassSubjectApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to delete teacher class subject."
        );
    }
};
