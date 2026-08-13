import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    createSubject,
    updateSubject,
} from "../../../Services/subjectService";

import SubjectPreview from "./SubjectPreview";

export default function SubjectForm({
    subject,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        code: "",
        name: "",
        credit: "",
        description: "",
        isActive: true,
    });

    useEffect(() => {

        if (!subject) return;

        setForm({
            code: subject.code,
            name: subject.name,
            credit: subject.credit,
            description: subject.description ?? "",
            isActive: subject.isActive,
        });

    }, [subject]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    const resetForm = () => {

        setForm({
            code: "",
            name: "",
            credit: "",
            description: "",
            isActive: true,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const payload = {
                ...form,
                credit: Number(form.credit),
            };

            if (subject) {

                await updateSubject(subject.id, payload);

                toast.success("Subject updated successfully.");

            } else {

                await createSubject(payload);

                toast.success("Subject created successfully.");

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
            id="subjectForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Code */}
                    <div>

                        <label htmlFor="subjectCode" className="mb-1 block text-sm font-medium">
                            Subject Code <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="subjectCode"
                            type="text"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            required
                            placeholder="e.g. CSE-101"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Name */}
                    <div>

                        <label htmlFor="subjectName" className="mb-1 block text-sm font-medium">
                            Subject Name <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="subjectName"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Data Structures"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                    {/* Credit */}
                    <div>

                        <label htmlFor="subjectCredit" className="mb-1 block text-sm font-medium">
                            Credit <span className="text-rose-500">*</span>
                        </label>

                        <input
                            id="subjectCredit"
                            type="number"
                            name="credit"
                            value={form.credit}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.5"
                            placeholder="e.g. 3"
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Number of credit hours for this subject.
                        </p>

                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 sm:mt-7">

                        <input
                            id="subjectStatus"
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 accent-cyan-600"
                        />

                        <label htmlFor="subjectStatus" className="text-sm font-medium">
                            Active
                        </label>

                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">

                        <label htmlFor="subjectDescription" className="mb-1 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            id="subjectDescription"
                            rows={4}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Briefly describe this subject..."
                            className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        />

                    </div>

                </div>

                {/* Preview */}
                <SubjectPreview form={form} />

            </div>

            <button
                id="subjectFormSubmit"
                type="submit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
