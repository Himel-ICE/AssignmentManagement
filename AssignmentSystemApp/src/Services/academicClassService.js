import {
    getAllAcademicClassesApi,
    getAcademicClassByIdApi,
    createAcademicClassApi,
    updateAcademicClassApi,
    deleteAcademicClassApi,
} from "../api/academicClassApi";

export const getAllAcademicClasses = async () => {
    try {

        const response = await getAllAcademicClassesApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load academic classes."
        );

    }
};

export const createAcademicClass = async (payload) => {
    try {

        const response = await createAcademicClassApi(payload);

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

export const getAcademicClassById = async (id) => {
    try {

        const response = await getAcademicClassByIdApi(id);

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

export const updateAcademicClass = async (id, payload) => {
    try {

        const response = await updateAcademicClassApi(id, payload);

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

export const deleteAcademicClass = async (id) => {
    try {

        const response = await deleteAcademicClassApi(id);

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
