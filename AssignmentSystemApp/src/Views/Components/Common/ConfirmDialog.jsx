import { useState } from "react";
import { RiAlertLine, RiCloseLine } from "react-icons/ri";

export default function ConfirmDialog({
    open,
    title = "Confirm",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = true,
    onCancel,
    onConfirm,
}) {

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm?.();
        } finally {
            setLoading(false);
            onCancel?.();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-100/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-300 bg-cyan-100/30 shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-cyan-200 px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="shrink-0 rounded-lg p-2 transition hover:bg-rose-800/20 hover:text-rose-700"
                    >
                        <RiCloseLine size={22} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? "bg-rose-100 text-rose-600" : "bg-cyan-100 text-cyan-600"}`}>
                            <RiAlertLine size={22} />
                        </span>
                        <p className="pt-2 text-gray-700">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-cyan-200 px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border px-5 py-2 transition hover:bg-gray-100 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`rounded-lg px-5 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60 ${danger ? "bg-rose-600" : "bg-cyan-600"}`}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
