import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = storage.getToken();
        const currentUser = storage.getUser();
        if (token && currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);
    const login = ({ token, user }) => {
        storage.setToken(token);
        storage.setUser(user);
        setUser(user);
    };
    const logout = () => {
        storage.clear();
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, }} >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}