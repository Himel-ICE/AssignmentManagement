export default function UserPreview({ form, roles }) {

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        identityNumber,
        gender,
        roleId,
    } = form;

    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || "Full Name";

    const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";

    const roleName = roles.find((r) => r.id === Number(roleId))?.name;

    const previewRows = [
        { label: "Phone", value: phoneNumber },
        { label: "Gender", value: gender },
        { label: "ID Number", value: identityNumber },
    ].filter((row) => row.value?.trim());

    return (
        <div className="lg:sticky lg:top-0">

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Live Preview
            </h3>

            <div className="rounded-2xl border border-cyan-200 bg-white p-4 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-white">
                    {initials}
                </div>

                <h4 className="mt-3 truncate text-lg font-bold text-gray-800">
                    {fullName}
                </h4>

                <p className="truncate text-sm text-cyan-600">
                    {email?.trim() || "user@example.com"}
                </p>

                <div className="mt-2">

                    <span className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {roleName || "Select Role"}
                    </span>

                </div>

                <div className="mt-4 space-y-2 text-left text-sm">

                    {previewRows.length > 0 ? previewRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-2 rounded-lg border border-cyan-100 bg-cyan-50/50 px-3 py-2">

                            <span className="text-gray-500">
                                {row.label}
                            </span>

                            <span className="truncate font-semibold text-gray-800">
                                {row.value}
                            </span>

                        </div>
                    )) : (
                        <p className="rounded-lg border border-dashed border-cyan-200 px-3 py-2 text-center text-xs text-gray-400">
                            Additional details will appear here.
                        </p>
                    )}

                </div>

            </div>

        </div>
    );

}
