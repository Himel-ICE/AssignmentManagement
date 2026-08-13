export default function SubmissionStatusBadge({ status }) {

    const styles = {
        1: "bg-blue-100 text-blue-700",
        2: "bg-green-100 text-green-700",
        3: "bg-red-100 text-red-700",
    };

    const labels = {
        1: "Submitted",
        2: "Reviewed",
        3: "Rejected",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                styles[status] || styles[1]
            }`}
        >
            {labels[status] || "Unknown"}
        </span>
    );
}
