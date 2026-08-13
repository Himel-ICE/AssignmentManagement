import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { submitAnswer, updateSubmission } from "../../../Services/submissionService";
import RichTextEditor from "../Common/RichTextEditor";

export default function SubmitForm({
    availableAssignments,
    assignment,
    submission,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const isEditing = Boolean(submission);

    const [form, setForm] = useState({
        assignmentId: assignment?.id ?? submission?.assignmentId ?? "",
        answer: submission?.answer ?? "",
    });

    useEffect(() => {

        if (!assignment) return;

        setForm(prev => ({
            ...prev,
            assignmentId: assignment.id,
        }));

    }, [assignment]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.assignmentId) {
            toast.error("Please select an assignment.");
            return;
        }

        if (!form.answer.trim()) {
            toast.error("Please write an answer before submitting.");
            return;
        }

        const payload = {
            assignmentId: Number(form.assignmentId),
            answer: form.answer.trim(),
        };

        try {

            setLoading(true);

            if (isEditing) {
                await updateSubmission(submission.id, { answer: payload.answer });
                toast.success("Submission updated successfully.");
            } else {
                await submitAnswer(payload);
                toast.success("Assignment submitted successfully.");
            }

            setForm({ assignmentId: "", answer: "" });

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
            id="submissionForm"
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            {/* Assignment */}
            {assignment ? (
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Assignment
                    </p>
                    <p className="font-medium">
                        {assignment.title}
                    </p>
                    <p className="text-sm text-gray-600">
                        {assignment.subjectName} - {assignment.class} - {assignment.teacherName}
                    </p>
                    <p className="text-sm text-gray-600">
                        Deadline: {new Date(assignment.deadline).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        Maximum Marks: {assignment.maximumMarks}
                    </p>
                </div>
            ) : (
                <div>

                    <label htmlFor="submissionAssignment" className="mb-1 block text-sm font-medium">
                        Assignment <span className="text-rose-500">*</span>
                    </label>

                    <select
                        id="submissionAssignment"
                        name="assignmentId"
                        value={form.assignmentId}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-cyan-300 px-4 py-2 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    >
                        <option value="" disabled>
                            Select assignment...
                        </option>

                        {availableAssignments.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.subjectName} - {a.title} (Due: {new Date(a.deadline).toLocaleString()})
                            </option>
                        ))}

                    </select>

                </div>
            )}

            {/* Answer */}
            <div>

                <span className="mb-1 block text-sm font-medium">
                    Your Answer <span className="text-rose-500">*</span>
                </span>

                <RichTextEditor
                    value={form.answer}
                    onChange={(html) =>
                        setForm((prev) => ({
                            ...prev,
                            answer: html,
                        }))
                    }
                    maxLength={5000}
                    placeholder="Write your answer here. Use the toolbar to bold, italicize, add lists, or insert math symbols and equations ( $...$ for inline, $$...$$ for display)."
                />

            </div>

            <button
                id="submissionFormSubmit"
                type="submit"
                className="hidden"
                disabled={loading}
            />

        </form>

    );

}
