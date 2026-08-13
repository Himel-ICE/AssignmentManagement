import api from "./axios";

const ACADEMIC_CLASS_BASE = "/AcademicClass";

export const getAllAcademicClassesApi = async () => {
    const response = await api.get(`${ACADEMIC_CLASS_BASE}/get-all`);
    return response.data;
};

export const createAcademicClassApi = async (payload) => {
    const response = await api.post(`${ACADEMIC_CLASS_BASE}/create`, payload);
    return response.data;
};

export const getAcademicClassByIdApi = async (id) => {
    const response = await api.get(`${ACADEMIC_CLASS_BASE}/get/${id}`);
    return response.data;
};

export const updateAcademicClassApi = async (id, payload) => {
    const response = await api.put(`${ACADEMIC_CLASS_BASE}/update/${id}`, payload);
    return response.data;
};

export const deleteAcademicClassApi = async (id) => {
    const response = await api.delete(`${ACADEMIC_CLASS_BASE}/delete/${id}`);
    return response.data;
};
