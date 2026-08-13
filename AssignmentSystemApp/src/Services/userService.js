import { getAllUsersApi, getUserByIdApi, createUserApi, updateUserApi, deleteUserApi,} from "../api/userApi";

export const getAllUsers = async () => {
    try {
        const response = await getAllUsersApi();

        if (!response.success) {
            throw new Error(response.message || "Failed to load users.");
        }

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load users."
        );
    }
};

export const getUserById = async (id) => {
    try {
        const response = await getUserByIdApi(id);

        if (!response.success) {
            throw new Error(response.message || "Failed to load user.");
        }
        alert(response.message);
        return response.data;
       
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load user."
        );
    }
};

export const createUser = async (payload) => {
    try {
        const response = await createUserApi(payload);

        if (!response.success) {
            throw new Error(response.message || "User creation failed.");
        }

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to create user."
        );
    }
};

export const updateUser = async (id, payload) => {
    try {
        const response = await updateUserApi(id, payload);

        if (!response.success) {
            throw new Error(response.message || "User update failed.");
        }

        return response;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to update user."
        );
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await deleteUserApi(id);

        if (!response.success) {
            throw new Error(response.message || "User delete failed.");
        }

        return response;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to delete user."
        );
    }
};