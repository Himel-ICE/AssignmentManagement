import { useState, useEffect } from "react";
import useRoles from "../../../hooks/useRoles";
import { createUser } from "../../../Services/userService";
import toast from "react-hot-toast";

import UserPreview from "./UserPreview";

export default function UserForm({ user, editUser, onClose, onSuccess }) {

    const { roles } = useRoles();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        identityNumber: "",
        gender: "",
        roleId: "",
        isActive: true
    });
    useEffect(() => {
        if (!user) return;
        setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: "",
            identityNumber: user.identityNumber ?? "",
            gender: user.gender,
            roleId: user.roleId,
            isActive: user.isActive,
        });
    }, [user]);
    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const resetForm = () => {
        setForm({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            identityNumber: "",
            gender: "",
            roleId: "",
            isActive: true
        });
    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            if (user) {

                await editUser(user.id, {
                    ...form,
                    roleId: Number(form.roleId),
                });

                toast.success("User updated successfully.");

            }
            else {

                await createUser({
                    ...form,
                    roleId: Number(form.roleId),
                });

                toast.success("User created successfully.");

            }

            resetForm();

            onClose?.();

            onSuccess?.();

        }
        catch (error) {

            toast.error(error.message);

        }
        finally {

            setLoading(false);

        }

    };

    const inputClass = "w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

    return (
        <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* First Name */}
                    <div>
                        <label htmlFor="userFirstName" className="mb-1 block text-sm font-medium">
                            First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="userFirstName"
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John"
                            autoComplete="given-name"
                            className={inputClass}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="userLastName" className="mb-1 block text-sm font-medium">
                            Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="userLastName"
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Doe"
                            autoComplete="family-name"
                            className={inputClass}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="userEmail" className="mb-1 block text-sm font-medium">
                            Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="userEmail"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="e.g. john.doe@example.com"
                            autoComplete="email"
                            className={inputClass}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="userPhone" className="mb-1 block text-sm font-medium">
                            Phone Number
                        </label>
                        <input
                            id="userPhone"
                            type="tel"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g. 01XXXXXXXXX"
                            autoComplete="tel"
                            className={inputClass}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="userPassword" className="mb-1 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="userPassword"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={user ? "Leave blank to keep current" : "Enter a password"}
                            autoComplete="new-password"
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            {user ? "Only required if you want to change it." : "Used to log in to the system."}
                        </p>
                    </div>

                    {/* Identity Number */}
                    <div>
                        <label htmlFor="userIdentity" className="mb-1 block text-sm font-medium">
                            Identity Number
                        </label>
                        <input
                            id="userIdentity"
                            type="text"
                            name="identityNumber"
                            value={form.identityNumber}
                            onChange={handleChange}
                            placeholder="e.g. NID / Student ID"
                            className={inputClass}
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="userGender" className="mb-1 block text-sm font-medium">
                            Gender
                        </label>
                        <select
                            id="userGender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="userRole" className="mb-1 block text-sm font-medium">
                            Role <span className="text-rose-500">*</span>
                        </label>
                        <select
                            id="userRole"
                            name="roleId"
                            value={form.roleId}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option
                                    key={role.id}
                                    value={role.id}
                                >
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between rounded-lg border border-cyan-300 px-4 py-3">
                            <div>
                                <label htmlFor="userActive" className="block text-sm font-medium">
                                    Active
                                </label>
                                <p className="text-xs text-gray-400">
                                    Inactive users cannot log in to the system.
                                </p>
                            </div>
                            <button
                                type="button"
                                id="userActive"
                                role="switch"
                                aria-checked={form.isActive}
                                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                    form.isActive ? "bg-cyan-500" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                        form.isActive ? "translate-x-5" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Preview */}
                <UserPreview form={form} roles={roles} />

            </div>

            {/* Hidden submit button */}
            <button
                type="submit"
                id="userFormSubmit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
