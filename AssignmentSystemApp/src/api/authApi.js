import api from "./axios";

const AUTH_BASE = "/Auth";

export const loginApi = async (payload) => {
    const response = await api.post(`${AUTH_BASE}/login`, payload);
    return response.data;
};

// export const refreshTokenApi = async (payload) => {
//     const response = await api.post(`${AUTH_BASE}/refresh-token`, payload);
//     return response.data;
// };

// export const logoutApi = async () => {
//     const response = await api.post(`${AUTH_BASE}/logout`);
//     return response.data;
// };