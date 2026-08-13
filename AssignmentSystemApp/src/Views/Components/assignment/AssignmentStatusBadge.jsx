export default function AssignmentStatusBadge({ status, isExpired }) {

    const styles = {
        1: "bg-amber-100 text-amber-700",
        2: "bg-green-100 text-green-700",
        3: "bg-gray-100 text-gray-600",
    };

    const labels = {
        1: "Draft",
        2: "Published",
        3: "Closed",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isExpired ? "bg-red-100 text-red-700" : styles[status] || styles[3]
            }`}
        >
            {isExpired && (
                <span className="size-1.5 rounded-full bg-red-600" />
            )}
            {labels[status] || "Unknown"}
        </span>
    );
}
