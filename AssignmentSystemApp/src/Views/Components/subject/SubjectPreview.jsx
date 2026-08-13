import UserStatusBadge from "../users/UserStatusBadge";

export default function SubjectPreview({ form }) {

    const { code, name, credit, description, isActive } = form;

    return (
        <div className="lg:sticky lg:top-0">

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Live Preview
            </h3>

            <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm">

                <div className="flex items-start justify-between gap-3 border-b border-cyan-100 pb-3">

                    <div className="min-w-0">

                        <h4 className="truncate text-lg font-bold text-gray-800">
                            {name?.trim() || "Subject Name"}
                        </h4>

                        <p className="text-sm font-medium text-cyan-600">
                            {code?.trim() || "CODE"}
                        </p>

                    </div>

                    <UserStatusBadge active={isActive} />

                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg border border-cyan-100 bg-cyan-50/50 px-3 py-2 text-sm">

                    <span className="text-gray-500">
                        Credit Hours
                    </span>

                    <span className="font-semibold text-gray-800">
                        {credit || "—"}
                    </span>

                </div>

                <div className="mt-3">

                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Description
                    </p>

                    <p className="min-h-[3rem] text-sm text-gray-600">
                        {description?.trim() || "No description provided."}
                    </p>

                </div>

            </div>

        </div>
    );

}
