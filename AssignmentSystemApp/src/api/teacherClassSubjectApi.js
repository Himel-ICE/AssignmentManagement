import api from "./axios";

const BASE = "/teacher-class-subject";

export const getAllTeacherClassSubjectsApi = async () => {
    const response = await api.get(`${BASE}/get-all`);
    return response.data;
};

export const getMyTeacherClassSubjectsApi = async () => {
    const response = await api.get(`${BASE}/my`);
    return response.data;
};

export const getTeacherClassSubjectByIdApi = async (id) => {
    const response = await api.get(`${BASE}/get/${id}`);
    return response.data;
};

export const createTeacherClassSubjectApi = async (payload) => {
    const response = await api.post(`${BASE}/create`, payload);
    return response.data;
};

export const updateTeacherClassSubjectApi = async (id, payload) => {
    const response = await api.put(`${BASE}/update/${id}`, payload);
    return response.data;
};

export const deleteTeacherClassSubjectApi = async (id) => {
    const response = await api.delete(`${BASE}/delete/${id}`);
    return response.data;
};
