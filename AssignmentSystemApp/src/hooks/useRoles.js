import { useEffect, useState } from "react";
import roleService from "../Services/roleService";
export default function useRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadRoles();
    }, []);
    const loadRoles = async () => {

        try {
            const data = await roleService.getDropdown();
            setRoles(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    return {
        roles,
        loading,
        reload: loadRoles
    };

}