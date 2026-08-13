import { loginApi } from "../api/authApi";

export const loginService = async ({ email, password }) => {
    try {
        if (!email?.trim()) { throw new Error("Email is required."); }
        if (!password?.trim()) { throw new Error("Password is required."); }
        const response = await loginApi({email, password,});
        if (!response.success) {
            throw new Error(response.message || "Login failed.");
        }
        return {
            token: response.data.token,
            expiration: response.data.expiration,
            user: {
                id: response.data.userId,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                role: response.data.role,
            },
            message: response.message,
        };
    } 
    catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to login."
        );
    }
};