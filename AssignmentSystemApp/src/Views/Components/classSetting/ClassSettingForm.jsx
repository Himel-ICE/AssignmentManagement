import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useClassSettingDropdowns from "../../../hooks/useClassSettingDropdowns";
import {
    createTeacherClassSubject,
    updateTeacherClassSubject,
} from "../../../Services/teacherClassSubjectService";

export default function ClassSettingForm({
    assignment,
    onClose,
    onSuccess,
}) {

    const { teachers, classes, subjects, loading } = useClassSettingDropdowns();

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        teacherId: "",
        academicClassId: "",
        subjectId: "",
        isActive: true,
    });

    useEffect(() => {
        if (!assignment) return;
        setForm({
            teacherId: assignment.teacherId,
            academicClassId: assignment.academicClassId,
            subjectId: assignment.subjectId,
            isActive: assignment.isActive,
        });
    }, [assignment]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm({
            teacherId: "",
            academicClassId: "",
            subjectId: "",
            isActive: true,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const payload = {
                ...form,
                teacherId: Number(form.teacherId),
                academicClassId: Number(form.academicClassId),
                subjectId: Number(form.subjectId),
            };

            if (assignment) {
                await updateTeacherClassSubject(assignment.id, payload);
                toast.success("Assignment updated successfully.");
            } else {
                await createTeacherClassSubject(payload);
                toast.success("Teacher assigned successfully.");
            }

            resetForm();
            onSuccess?.();
            onClose?.();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

    return (
        <form
            id="classSettingForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Teacher */}
                <div className="sm:col-span-2">
                    <label htmlFor="assignmentTeacher" className="mb-1 block text-sm font-medium">
                        Teacher <span className="text-rose-500">*</span>
                    </label>
                    <select
                        id="assignmentTeacher"
                        name="teacherId"
                        value={form.teacherId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className={inputClass}
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Academic Class */}
                <div>
                    <label htmlFor="assignmentClass" className="mb-1 block text-sm font-medium">
                        Class <span className="text-rose-500">*</span>
                    </label>
                    <select
                        id="assignmentClass"
                        name="academicClassId"
                        value={form.academicClassId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className={inputClass}
                    >
                        <option value="">Select Class</option>
                        {classes.map(classItem => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subject */}
                <div>
                    <label htmlFor="assignmentSubject" className="mb-1 block text-sm font-medium">
                        Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                        id="assignmentSubject"
                        name="subjectId"
                        value={form.subjectId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className={inputClass}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                    <input
                        id="assignmentStatus"
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 accent-cyan-600"
                    />
                    <label htmlFor="assignmentStatus" className="text-sm font-medium">
                        Active
                    </label>
                </div>

            </div>

            {loading && (
                <p className="text-sm text-gray-400">
                    Loading options...
                </p>
            )}

            <button
                id="classSettingFormSubmit"
                type="submit"
                className="hidden"
                disabled={saving}
            />

        </form>
    );
}
