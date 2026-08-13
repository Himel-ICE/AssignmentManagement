import { useState } from "react";
import {
    RiDeleteBin6Line,
    RiEditLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

import CommonModal from "../Common/CommonModal";
import ConfirmDialog from "../Common/ConfirmDialog";
import SubjectForm from "./SubjectForm";
import UserStatusBadge from "../users/UserStatusBadge";

export default function SubjectTableRow({ index, subject, editSubject, removeSubject, canManage = true, }) {
    const [open, setOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleDelete = () => {
        setConfirmAction({
            title: "Delete Subject",
            message: "Are you sure you want to delete this subject?",
            confirmText: "Delete",
            run: async () => {
                await removeSubject(subject.id);
                toast.success("Subject deleted successfully.");
            },
        });
    };
    return (
        <>
            <tr className="border-t border-cyan-100">
                <td className="px-4 py-3"> {index + 1} </td>
                <td className="px-4 py-3"> {subject.code} </td>
                <td className="px-4 py-3 font-medium"> {subject.name} </td>
                <td className="px-4 py-3 text-center"> {subject.credit} </td>
                <td className="px-4 py-3"> {subject.description} </td>
                <td className="px-4 py-3 text-center">
                    <UserStatusBadge active={subject.isActive} />
                </td>
                {canManage && (
                    <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                            <button onClick={() => setOpen(true)} className="rounded-lg p-2 transition hover:bg-yellow-100" >
                                <RiEditLine size={18} />
                            </button>
                            <button onClick={handleDelete} className="rounded-lg p-2 transition hover:bg-red-100" >
                                <RiDeleteBin6Line size={18} />
                            </button>
                        </div>

                        <CommonModal open={open} title="Edit Subject" onClose={() => setOpen(false)} formId="subjectForm" >
                            <SubjectForm subject={subject} editSubject={editSubject} onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
                        </CommonModal>
                    </td>
                )}
            </tr>

            <ConfirmDialog
                open={confirmAction !== null}
                title={confirmAction?.title}
                message={confirmAction?.message}
                confirmText={confirmAction?.confirmText}
                onCancel={() => setConfirmAction(null)}
                onConfirm={async () => {
                    try {
                        await confirmAction?.run();
                    } catch (error) {
                        toast.error(error.message);
                    }
                }}
            />
        </>
    );

}