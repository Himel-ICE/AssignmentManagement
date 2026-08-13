import api from "./axios";

const SUBJECT_BASE = "/Subject";

export const getAllSubjectsApi = async () => {
    const response = await api.get(`${SUBJECT_BASE}/get-all`);
    return response.data;
};

export const getSubjectByIdApi = async (id) => {
    const response = await api.get(`${SUBJECT_BASE}/get/${id}`);
    return response.data;
};

export const createSubjectApi = async (payload) => {
    const response = await api.post(`${SUBJECT_BASE}/create`, payload);
    return response.data;
};

export const updateSubjectApi = async (id, payload) => {
    const response = await api.put(`${SUBJECT_BASE}/update/${id}`, payload);
    return response.data;
};

export const deleteSubjectApi = async (id) => {
    const response = await api.delete(`${SUBJECT_BASE}/delete/${id}`);
    return response.data;
};