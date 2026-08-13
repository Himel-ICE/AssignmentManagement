import {
    getAllAssignmentsApi,
    getAssignmentByIdApi,
    createAssignmentApi,
    updateAssignmentApi,
    deleteAssignmentApi,
    publishAssignmentApi,
    closeAssignmentApi,
} from "../api/assignmentApi";

const extractError = (error, fallback) =>
    new Error(
        error.response?.data?.message ||
        error.message ||
        fallback
    );

export const getAllAssignments = async () => {
    try {
        const response = await getAllAssignmentsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to load assignments.");
    }
};

export const getAssignmentById = async (id) => {
    try {
        const response = await getAssignmentByIdApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to load assignment.");
    }
};

export const createAssignment = async (payload) => {
    try {
        const response = await createAssignmentApi(payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to create assignment.");
    }
};

export const updateAssignment = async (id, payload) => {
    try {
        const response = await updateAssignmentApi(id, payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to update assignment.");
    }
};

export const deleteAssignment = async (id) => {
    try {
        const response = await deleteAssignmentApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to delete assignment.");
    }
};

export const publishAssignment = async (id) => {
    try {
        const response = await publishAssignmentApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to publish assignment.");
    }
};

export const closeAssignment = async (id) => {
    try {
        const response = await closeAssignmentApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to close assignment.");
    }
};
