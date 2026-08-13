import useUsers from "../../../hooks/useUsers";
import { useState } from "react";
import UserToolbar from "../../Components/users/UserToolbar";
import UserTable from "../../Components/users/UserTable";
import LoadingState from "../../Components/users/LoadingState";
import EmptyState from "../../Components/users/EmptyState";

export default function Users() {
    const { users, loading, error, loadUsers, editUser, removeUser} = useUsers();
    const [search, setSearch] = useState("");

    if (loading) {
        return <LoadingState />;
    }
    if (error) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                {error}
            </div>
        );
    }
    const filteredUsers = users.filter((x) => x.fullName.toLowerCase().includes(search.toLowerCase()) || x.email.toLowerCase().includes(search.toLowerCase()));
    return (

        <div className="space-y-5">
            <div className="mx-auto w-full max-w-5xl">
                <UserToolbar
                    total={filteredUsers.length}
                    search={search}
                    onSearch={setSearch}
                    loadUsers={loadUsers}
                    onAdd={() => console.log("Open Add Modal")}
                />
            </div>

            <div className="mx-auto w-full max-w-5xl">
                {filteredUsers.length === 0 ? (
                    <EmptyState />
                ) : (
                    <UserTable users={filteredUsers} editUser={editUser} removeUser={removeUser}/>
                )}
            </div>
        </div>

    );

}