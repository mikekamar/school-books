import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function SchoolDetails({ school }) {

    return (
        <AuthenticatedLayout>

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Breadcrumb */}

                <div className="flex items-center justify-between">

                    <div>

                        <div className="text-sm text-gray-500">

                            <Link
                                href={route("reports.delivery-summary")}
                                className="hover:text-indigo-600"
                            >
                                Reports
                            </Link>

                            <span className="mx-2">/</span>

                            <Link
                                href={route("reports.county-progress")}
                                className="hover:text-indigo-600"
                            >
                                Counties
                            </Link>

                            <span className="mx-2">/</span>

                            <span className="font-medium text-gray-700">
                                School Details
                            </span>

                        </div>

                        <h1 className="mt-2 text-3xl font-bold">

                            {school.profile.name}

                        </h1>

                        <p className="mt-1 text-gray-500">

                            UIC: {school.profile.uic}

                        </p>

                    </div>

                    <div className="flex gap-3">

                        <button
                            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                        >
                            🖨 Print
                        </button>

                        <button
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Export PDF
                        </button>

                    </div>

                </div>

                {/* Hero Card */}

                <div className="rounded-xl bg-white shadow border p-6">

                    <div className="flex items-center gap-4">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-4xl">

                            🏫

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">

                                {school.profile.name}

                            </h2>

                            <div className="mt-2 flex flex-wrap gap-6 text-gray-600">

                                <span>

                                    📍 {school.location.county.name}

                                </span>

                                <span>

                                    {school.location.sub_county.name}

                                </span>

                                <span>

                                    UIC: {school.profile.uic}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* KPI Cards */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <Card
                        title="Delivery Status"
                        value={school.dispatch.status}
                        color="green"
                    />

                    <Card
                        title="Dispatch Number"
                        value={school.dispatch.number}
                        color="blue"
                    />

                    <Card
                        title="Field Agent"
                        value={school.dispatch.field_agent?.name}
                        color="amber"
                    />

                    <Card
                        title="Delivered On"
                        value={school.dispatch.delivered_at}
                        color="indigo"
                    />

                </div>

                {/* Placeholder sections */}

                <Section title="Receiver Information">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <Info
                        label="Receiver Name"
                        value={school.receiver.name}
                    />

                    <Info
                        label="Phone Number"
                        value={school.receiver.phone}
                    />

                    <Info
                        label="ID Number"
                        value={school.receiver.id_number}
                    />

                    <Info
                        label="Designation"
                        value={school.receiver.designation}
                    />

                </div>

                </Section>

                <Section title="Books Delivered">

    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

                <tr>

                    <th className="px-6 py-3 text-left text-sm font-semibold">
                        Book
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-semibold">
                        Allocated
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-semibold">
                        Received
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-semibold">
                        Variance
                    </th>

                    <th className="px-6 py-3 text-center text-sm font-semibold">
                        Status
                    </th>

                </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

                {school.books.map((book) => {

                    const allocated = Number(book.allocated ?? 0);
                    const received = Number(book.received ?? 0);
                    const variance = allocated - received;

                    return (

                        <tr key={book.id} className="hover:bg-gray-50">

                            <td className="px-6 py-4">

                                <div>

                                    <p className="font-medium">

                                        {book.title}

                                    </p>

                                    <p className="text-xs text-gray-500">

                                        {book.publisher}

                                    </p>

                                </div>

                            </td>

                            <td className="px-6 py-4 text-center font-semibold">

                                {allocated}

                            </td>

                            <td className="px-6 py-4 text-center">

                                {received}

                            </td>

                            <td className="px-6 py-4 text-center">

                                {variance}

                            </td>

                            <td className="px-6 py-4 text-center">

                                <StatusBadge
                                    variance={variance}
                                />

                            </td>

                        </tr>

                    );

                })}

            </tbody>

        </table>

    </div>

</Section>

                <Section title="Delivery Timeline" />

                <Section title="Dispatch History" />

            </div>

        </AuthenticatedLayout>
    );
}

function Card({ title, value, color = "indigo" }) {

    const colors = {
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        amber: "bg-amber-100 text-amber-700",
        indigo: "bg-indigo-100 text-indigo-700",
    };

    return (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">

                        {title}

                    </p>

                    <h2 className="mt-3 text-2xl font-bold">

                        {value ?? "-"}

                    </h2>

                </div>

            </div>

        </div>

    );

}

function Section({ title, children }) {

    return (

        <div className="rounded-xl border bg-white shadow">

            <div className="border-b px-6 py-4">

                <h2 className="text-lg font-semibold">

                    {title}

                </h2>

            </div>

            <div className="p-6">

                {children ?? (

                    <p className="text-gray-400">

                        Coming next...

                    </p>

                )}

            </div>

        </div>

    );

}

function Info({ label, value }) {

    return (

        <div>

            <p className="text-sm text-gray-500">

                {label}

            </p>

            <p className="mt-1 text-lg font-semibold">

                {value || "-"}

            </p>

        </div>

    );

}

function StatusBadge({ variance }) {

    if (variance === 0) {

        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Complete
            </span>
        );

    }

    if (variance > 0) {

        return (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                Pending
            </span>
        );

    }

    return (

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">

            Over

        </span>

    );

}