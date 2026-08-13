export default function EmptyState({ mine = false }) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <h2 className="text-xl font-semibold">
                {mine ? "No Submissions Yet" : "No Submissions Found"}
            </h2>

            <p className="mt-2 text-gray-500">
                {mine
                    ? "Submit an answer to a published assignment."
                    : "Submissions will appear here when students submit."}
            </p>
        </div>
    );
}
