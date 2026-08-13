import api from "./axios";

export const getTeachersDropdownApi = async () => {
    const response = await api.get("/User/dropdown/teachers");
    return response.data;
};

export const getClassesDropdownApi = async () => {
    const response = await api.get("/AcademicClass/dropdown");
    return response.data;
};

export const getSubjectsDropdownApi = async () => {
    const response = await api.get("/Subject/dropdown");
    return response.data;
};
