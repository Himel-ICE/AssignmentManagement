import api from "./axios";

const USER_BASE = "/User";

export const getAllUsersApi = async () => {
    const response = await api.get(`${USER_BASE}/all`);
    return response.data;
};

export const getUserByIdApi = async (id) => {
    const response = await api.get(`${USER_BASE}/Get-by-id/${id}`);
    return response.data;
};

export const createUserApi = async (payload) => {
    const response = await api.post(`${USER_BASE}/create`, payload);
    return response.data;
};

export const updateUserApi = async (id, payload) => {
    const response = await api.put(`${USER_BASE}/update/${id}`, payload);
    return response.data;
};

export const deleteUserApi = async (id) => {
    const response = await api.delete(`${USER_BASE}/delete/${id}`);
    return response.data;
};