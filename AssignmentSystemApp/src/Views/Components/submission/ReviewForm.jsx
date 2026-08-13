import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { reviewSubmission } from "../../../Services/submissionService";
import RichTextDisplay from "../Common/RichTextDisplay";

export default function ReviewForm({
    submission,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        marks: "",
        feedback: "",
        status: 1,
    });

    useEffect(() => {

        if (!submission) return;

        setForm({
            marks: submission.marks ?? "",
            feedback: submission.feedback ?? "",
            status: submission.status ?? 1,
        });

    }, [submission]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: name === "status" ? Number(value) : value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {
            marks: form.marks === "" || form.marks === null ? null : Number(form.marks),
            feedback: form.feedback.trim() || null,
            status: Number(form.status),
        };

        try {

            setLoading(true);

            await reviewSubmission(submission.id, payload);

            toast.success("Submission reviewed successfully.");

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
            id="reviewForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            {submission?.answer && (
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Student Answer
                    </p>
                    <RichTextDisplay content={submission.answer} />
                </div>
            )}

            {/* Marks */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                    <label htmlFor="reviewMarks" className="mb-1 block text-sm font-medium">
                        Marks
                    </label>

                    <input
                        id="reviewMarks"
                        type="number"
                        name="marks"
                        value={form.marks}
                        onChange={handleChange}
                        min="0"
                        max="1000"
                        step="0.5"
                        placeholder="e.g. 85"
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />

                </div>

                {/* Status */}
                <div>

                    <label htmlFor="reviewStatus" className="mb-1 block text-sm font-medium">
                        Status <span className="text-rose-500">*</span>
                    </label>

                    <select
                        id="reviewStatus"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    >
                        <option value={1}>Submitted</option>
                        <option value={2}>Reviewed</option>
                        <option value={3}>Rejected</option>
                    </select>

                </div>

            </div>

            {/* Feedback */}
            <div>

                <label htmlFor="reviewFeedback" className="mb-1 block text-sm font-medium">
                    Feedback
                </label>

                <textarea
                    id="reviewFeedback"
                    rows={4}
                    name="feedback"
                    value={form.feedback}
                    onChange={handleChange}
                    maxLength={2000}
                    placeholder="Feedback for the student..."
                    className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

            </div>

            <button
                id="reviewFormSubmit"
                type="submit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
