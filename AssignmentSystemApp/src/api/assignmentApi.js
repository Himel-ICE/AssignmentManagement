import api from "./axios";

const ASSIGNMENT_BASE = "/Assignment";

export const getAllAssignmentsApi = async () => {
    const response = await api.get(`${ASSIGNMENT_BASE}/get-all`);
    return response.data;
};

export const getAssignmentByIdApi = async (id) => {
    const response = await api.get(`${ASSIGNMENT_BASE}/get/${id}`);
    return response.data;
};

export const createAssignmentApi = async (payload) => {
    const response = await api.post(`${ASSIGNMENT_BASE}/create`, payload);
    return response.data;
};

export const updateAssignmentApi = async (id, payload) => {
    const response = await api.put(`${ASSIGNMENT_BASE}/update/${id}`, payload);
    return response.data;
};

export const deleteAssignmentApi = async (id) => {
    const response = await api.delete(`${ASSIGNMENT_BASE}/delete/${id}`);
    return response.data;
};

export const publishAssignmentApi = async (id) => {
    const response = await api.patch(`${ASSIGNMENT_BASE}/publish/${id}`);
    return response.data;
};

export const closeAssignmentApi = async (id) => {
    const response = await api.patch(`${ASSIGNMENT_BASE}/close/${id}`);
    return response.data;
};
