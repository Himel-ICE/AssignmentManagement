import {
    getTeachersDropdownApi,
    getClassesDropdownApi,
    getSubjectsDropdownApi,
} from "../api/dropdownApi";

const unwrap = (response, fallback) => {
    if (!response.success)
        throw new Error(response.message || fallback);
    return response.data ?? [];
};

export const getTeachersDropdown = async () => {
    try {
        const response = await getTeachersDropdownApi();
        return unwrap(response, "Unable to load teachers.");
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load teachers."
        );
    }
};

export const getClassesDropdown = async () => {
    try {
        const response = await getClassesDropdownApi();
        return unwrap(response, "Unable to load classes.");
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load classes."
        );
    }
};

export const getSubjectsDropdown = async () => {
    try {
        const response = await getSubjectsDropdownApi();
        return unwrap(response, "Unable to load subjects.");
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Unable to load subjects."
        );
    }
};
