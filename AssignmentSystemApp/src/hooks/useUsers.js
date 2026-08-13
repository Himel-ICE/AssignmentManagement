import { useEffect, useState } from "react";
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../Services/userService";

export default function useUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (payload) => {
        await createUser(payload);
        await loadUsers();
    };

    const editUser = async (id, payload) => {
        await updateUser(id, payload);
        await loadUsers();
    };

    const removeUser = async (id) => {
        await deleteUser(id);
        await loadUsers();
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return {
        users,
        loading,
        error,
        loadUsers,
        addUser,
        editUser,
        removeUser,
    };
}