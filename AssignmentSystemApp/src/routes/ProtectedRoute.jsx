import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace state={{ from: location }}/>
        );
    }
    if (roles && !roles.includes(user?.role?.toLowerCase())) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
