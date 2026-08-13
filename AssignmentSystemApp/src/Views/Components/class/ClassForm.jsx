import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    createAcademicClass,
    updateAcademicClass,
} from "../../../Services/academicClassService";

import ClassPreview from "./ClassPreview";

export default function ClassForm({
    classItem,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        department: "",
        semester: "",
        section: "",
        description: "",
        isActive: true,
    });

    useEffect(() => {

        if (!classItem) return;

        setForm({
            name: classItem.name,
            department: classItem.department,
            semester: classItem.semester,
            section: classItem.section,
            description: classItem.description ?? "",
            isActive: classItem.isActive,
        });

    }, [classItem]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    const resetForm = () => {

        setForm({
            name: "",
            department: "",
            semester: "",
            section: "",
            description: "",
            isActive: true,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            if (classItem) {

                await updateAcademicClass(classItem.id, form);

                toast.success("Class updated successfully.");

            } else {

                await createAcademicClass(form);

                toast.success("Class created successfully.");

            }

            resetForm();

            onSuccess?.();

            onClose?.();

        }
        catch (error) {

            toast.error(error.message);

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <form
            id="classForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Name */}
                    <div>

                        <label htmlFor="className" className="mb-1 block text-sm font-medium">
                            Class Name <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="className"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. B.Sc. in CSE"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Department */}
                    <div>

                        <label htmlFor="classDepartment" className="mb-1 block text-sm font-medium">
                            Department <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="classDepartment"
                            type="text"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Computer Science"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Semester */}
                    <div>

                        <label htmlFor="classSemester" className="mb-1 block text-sm font-medium">
                            Semester <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="classSemester"
                            type="text"
                            name="semester"
                            value={form.semester}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 3rd"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Section */}
                    <div>

                        <label htmlFor="classSection" className="mb-1 block text-sm font-medium">
                            Section <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="classSection"
                            type="text"
                            name="section"
                            value={form.section}
                            onChange={handleChange}
                            required
                            placeholder="e.g. A"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 sm:mt-7">

                        <input
                            id="classStatus"
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 accent-cyan-600"
                        />

                        <label htmlFor="classStatus" className="text-sm font-medium">
                            Active
                        </label>

                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">

                        <label htmlFor="classDescription" className="mb-1 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            id="classDescription"
                            rows={4}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Briefly describe this class..."
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                </div>

                {/* Preview */}
                <ClassPreview form={form} />

            </div>

            <button
                id="classFormSubmit"
                type="submit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
