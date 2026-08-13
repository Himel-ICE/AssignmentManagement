export default function EmptyState({ student = false }) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <h2 className="text-xl font-semibold">
                {student ? "No Assignments Available" : "No Assignments Found"}
            </h2>

            <p className="mt-2 text-gray-500">
                {student
                    ? "Published assignments will appear here."
                    : "Create your first assignment."}
            </p>
        </div>
    );
}
