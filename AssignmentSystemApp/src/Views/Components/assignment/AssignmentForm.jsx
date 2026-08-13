import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    createAssignment,
    updateAssignment,
} from "../../../Services/assignmentService";

const toLocalInputValue = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export default function AssignmentForm({
    assignment,
    teacherClassSubjects,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        teacherClassSubjectId: "",
        title: "",
        description: "",
        deadline: "",
        maximumMarks: "",
    });

    useEffect(() => {

        if (!assignment) return;

        setForm({
            teacherClassSubjectId: assignment.teacherClassSubjectId ?? "",
            title: assignment.title ?? "",
            description: assignment.description ?? "",
            deadline: toLocalInputValue(assignment.deadline),
            maximumMarks: assignment.maximumMarks ?? "",
        });

    }, [assignment]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

    };

    const resetForm = () => {

        setForm({
            teacherClassSubjectId: "",
            title: "",
            description: "",
            deadline: "",
            maximumMarks: "",
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {
            teacherClassSubjectId: Number(form.teacherClassSubjectId),
            title: form.title.trim(),
            description: form.description.trim(),
            deadline: new Date(form.deadline).toISOString(),
            maximumMarks: Number(form.maximumMarks),
        };

        try {

            setLoading(true);

            if (assignment) {

                await updateAssignment(assignment.id, payload);

                toast.success("Assignment updated successfully.");

            } else {

                await createAssignment(payload);

                toast.success("Assignment created successfully.");

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
            id="assignmentForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Teacher / Class / Subject */}
                <div className="sm:col-span-2">

                    <label htmlFor="assignmentTeacherClassSubject" className="mb-1 block text-sm font-medium">
                        Teacher / Class / Subject <span className="text-rose-500">*</span>
                    </label>

                    <select
                        id="assignmentTeacherClassSubject"
                        name="teacherClassSubjectId"
                        value={form.teacherClassSubjectId}
                        onChange={handleChange}
                        required
                        disabled={!!assignment}
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70"
                    >
                        <option value="" disabled>
                            Select teacher class subject...
                        </option>

                        {teacherClassSubjects.map((tcs) => (
                            <option key={tcs.id} value={tcs.id}>
                                {tcs.teacherName} - {tcs.academicClassName} - {tcs.subjectName}
                            </option>
                        ))}

                    </select>

                </div>

                {/* Title */}
                <div className="sm:col-span-2">

                    <label htmlFor="assignmentTitle" className="mb-1 block text-sm font-medium">
                        Title <span className="text-rose-500">*</span>
                    </label>

                    <input
                        id="assignmentTitle"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        placeholder="e.g. Chapter 1 Assignment"
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />

                </div>

                {/* Deadline */}
                <div>

                    <label htmlFor="assignmentDeadline" className="mb-1 block text-sm font-medium">
                        Deadline <span className="text-rose-500">*</span>
                    </label>

                    <input
                        id="assignmentDeadline"
                        type="datetime-local"
                        name="deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />

                </div>

                {/* Maximum Marks */}
                <div>

                    <label htmlFor="assignmentMarks" className="mb-1 block text-sm font-medium">
                        Maximum Marks <span className="text-rose-500">*</span>
                    </label>

                    <input
                        id="assignmentMarks"
                        type="number"
                        name="maximumMarks"
                        value={form.maximumMarks}
                        onChange={handleChange}
                        required
                        min="1"
                        max="1000"
                        step="0.5"
                        placeholder="e.g. 100"
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />

                </div>

                {/* Description */}
                <div className="sm:col-span-2">

                    <label htmlFor="assignmentDescription" className="mb-1 block text-sm font-medium">
                        Description <span className="text-rose-500">*</span>
                    </label>

                    <textarea
                        id="assignmentDescription"
                        rows={4}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        maxLength={2000}
                        placeholder="Describe the assignment..."
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />

                </div>

            </div>

            <button
                id="assignmentFormSubmit"
                type="submit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
