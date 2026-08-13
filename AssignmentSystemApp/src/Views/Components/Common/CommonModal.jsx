// import { RiCloseLine } from "react-icons/ri";

// export default function CommonModal({ open, title, children, onClose, onSave, saveText = "Save", cancelText = "Cancel", loading = false, width = "max-w-xl", showFooter = true, }) {
//     if (!open) return null;
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-100/10 p-4 backdrop-blur-sm">
//             <div className="absolute inset-0" onClick={onClose} />
//             <div className={` relative w-full ${width} rounded-3xl border border-cyan-300 bg-cyan-100/50 shadow-2xl `} >
//                 <div className="flex items-center justify-between border-b px-6 py-4 border-cyan-300/30">
//                     <h2 className="text-lg font-bold">
//                         {title}
//                     </h2>

//                     <button onClick={onClose} className="rounded-lg p-2 transition text-rose-800 hover:bg-cyan-100/20" >
//                         <RiCloseLine size={22} />
//                     </button>
//                 </div>
//                 {/* Body */}
//                 <div className="max-h-[70vh] overflow-y-auto p-6">
//                     {children}
//                 </div>
//                 {/* Footer */}
//                 {showFooter && (
//                     <div className="flex justify-end gap-3 border-t px-6 py-4 border-cyan-300/30">
//                         <button onClick={onClose} className="rounded-lg border px-5 py-2 transition hover:bg-cyan-100/20" >
//                             {cancelText}
//                         </button>
//                         <button onClick={onSave} disabled={loading} className="rounded-lg bg-cyan-600 px-5 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-60"  >
//                             {loading ? "Saving..." : saveText}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
import { RiCloseLine } from "react-icons/ri";

export default function CommonModal({
    open,
    title,
    children,
    onClose,
    saveText = "Save",
    cancelText = "Cancel",
    loading = false,
    width = "max-w-3xl",
    formId = "",
    showFooter = true,
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-100/40 backdrop-blur-sm sm:items-center sm:p-4">

            <div
                className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border border-cyan-300 bg-cyan-100/30 shadow-2xl sm:rounded-3xl ${width}`}
            >

                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-cyan-200 px-4 py-3 sm:px-6 sm:py-4">

                    <h2 className="min-w-0 truncate text-lg font-semibold sm:text-xl">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-lg p-2 transition hover:bg-rose-800/20 hover:text-rose-700"
                    >
                        <RiCloseLine size={22} />
                    </button>

                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>

                {/* Footer */}
                {showFooter && (

                    <div className="flex justify-end gap-3 border-t border-cyan-200 px-4 py-3 sm:px-6 sm:py-4">

                        <button
                            onClick={onClose}
                            className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="submit"
                            form={formId}
                            disabled={loading}
                            className="rounded-lg bg-cyan-600 px-5 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : saveText}
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}