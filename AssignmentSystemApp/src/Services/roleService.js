import api from "../api/axios";

const roleService = {

    getDropdown: async () => {
        const response = await api.get("/Role/dropdown");
        return response.data.data;
    }
};
export default roleService;