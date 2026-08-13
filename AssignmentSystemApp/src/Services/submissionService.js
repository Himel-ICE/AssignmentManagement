import {
    submitAnswerApi,
    updateSubmissionApi,
    getAllSubmissionsApi,
    getSubmissionsByAssignmentApi,
    getMySubmissionsApi,
    reviewSubmissionApi,
    deleteSubmissionApi,
} from "../api/submissionApi";

const extractError = (error, fallback) =>
    new Error(
        error.response?.data?.message ||
        error.message ||
        fallback
    );

export const submitAnswer = async (payload) => {
    try {
        const response = await submitAnswerApi(payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to submit answer.");
    }
};

export const updateSubmission = async (id, payload) => {
    try {
        const response = await updateSubmissionApi(id, payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to update submission.");
    }
};

export const getAllSubmissions = async () => {
    try {
        const response = await getAllSubmissionsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to load submissions.");
    }
};

export const getSubmissionsByAssignment = async (assignmentId) => {
    try {
        const response = await getSubmissionsByAssignmentApi(assignmentId);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to load submissions.");
    }
};

export const getMySubmissions = async () => {
    try {
        const response = await getMySubmissionsApi();

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to load your submissions.");
    }
};

export const reviewSubmission = async (id, payload) => {
    try {
        const response = await reviewSubmissionApi(id, payload);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to review submission.");
    }
};

export const deleteSubmission = async (id) => {
    try {
        const response = await deleteSubmissionApi(id);

        if (!response.success)
            throw new Error(response.message);

        return response.data;
    } catch (error) {
        throw extractError(error, "Unable to delete submission.");
    }
};
