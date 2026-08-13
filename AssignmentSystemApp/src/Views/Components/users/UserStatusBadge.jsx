export default function UserStatusBadge({ active }) {

    return (
        <span
            className={`
                inline-flex items-center rounded-full
                px-3 py-1 text-xs font-semibold
                ${
                    active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                }
            `}
        >
            {active ? "Active" : "Inactive"}
        </span>
    );

}