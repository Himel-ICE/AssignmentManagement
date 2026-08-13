import { useAuth } from "../../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const name = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "there";

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <h1 className="text-3xl font-bold">Welcome, {name}</h1>
        </div>
    );
}
