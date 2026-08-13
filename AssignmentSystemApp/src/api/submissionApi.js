import api from "./axios";

const SUBMISSION_BASE = "/Submission";

export const submitAnswerApi = async (payload) => {
    const response = await api.post(`${SUBMISSION_BASE}/submit`, payload);
    return response.data;
};

export const updateSubmissionApi = async (id, payload) => {
    const response = await api.put(`${SUBMISSION_BASE}/update/${id}`, payload);
    return response.data;
};

export const getAllSubmissionsApi = async () => {
    const response = await api.get(`${SUBMISSION_BASE}/get-all`);
    return response.data;
};

export const getSubmissionsByAssignmentApi = async (assignmentId) => {
    const response = await api.get(`${SUBMISSION_BASE}/assignment/${assignmentId}`);
    return response.data;
};

export const getMySubmissionsApi = async () => {
    const response = await api.get(`${SUBMISSION_BASE}/my`);
    return response.data;
};

export const reviewSubmissionApi = async (id, payload) => {
    const response = await api.put(`${SUBMISSION_BASE}/review/${id}`, payload);
    return response.data;
};

export const deleteSubmissionApi = async (id) => {
    const response = await api.delete(`${SUBMISSION_BASE}/delete/${id}`);
    return response.data;
};
