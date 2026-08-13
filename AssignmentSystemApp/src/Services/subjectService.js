import {
    getAllSubjectsApi,
    getSubjectByIdApi,
    createSubjectApi,
    updateSubjectApi,
    deleteSubjectApi,
} from "../api/subjectApi";

export const getAllSubjects = async () => {
    try {

        const response = await getAllSubjectsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load subjects."
        );

    }
};

export const getSubjectById = async (id) => {
    try {

        const response = await getSubjectByIdApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message
        );

    }
};

export const createSubject = async (payload) => {
    try {

        const response = await createSubjectApi(payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message
        );

    }
};

export const updateSubject = async (id, payload) => {
    try {

        const response = await updateSubjectApi(id, payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message
        );

    }
};

export const deleteSubject = async (id) => {
    try {

        const response = await deleteSubjectApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message
        );

    }
};